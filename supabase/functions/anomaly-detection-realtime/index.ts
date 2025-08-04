// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from './cors.ts'

Deno.serve(async (req: Request) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
  try {
    const body = await req.json().then((data) => data);

    console.log("Received request body:", body);

    const { data, error } = await supabaseClient.from('measurements').select("water_temperature, room_temperature, ph, do, flow_rate, turbidity, created_at").eq('env_id', body.aquarium_id).order('created_at', { ascending: false }).limit(2);

    if (error) {
      throw new Error("Failed to fetch data from Supabase: " + error.message);
    }

    // Get difference between the two latest measurements
    if (data.length < 2) {
      return new Response(JSON.stringify({ error: 'Not enough data to compare' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const latest = data[0];
    const previous = data[1];

    const differences = {
      water_temperature: Math.abs(latest.water_temperature - previous.water_temperature),
      room_temperature: Math.abs(latest.room_temperature - previous.room_temperature),
      ph: Math.abs(latest.ph - previous.ph),
      do: Math.abs(latest.do - previous.do),
      flow_rate: Math.abs(latest.flow_rate - previous.flow_rate),
      turbidity: Math.abs(latest.turbidity - previous.turbidity),
    }

    // Thresholds for anomalies
    const thresholds = {
      water_temperature: 0.5,
      room_temperature: 0.5,
      ph: 0.1,
      do: 0.5,
      flow_rate: 0.5,
      turbidity: 5,
    }

    const anomalies = Object.entries(differences).reduce((acc, [key, value]) => {
      if (value > thresholds[key]) {
        acc[key] = value;
      }
      return acc;
    }, {});

    if (Object.keys(anomalies).length === 0) {
      return new Response(JSON.stringify({ message: 'ok' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Insert alert into the database - map anomalies to array data
    const { error: insertError } = await supabaseClient.from('alerts').insert(
      Object.entries(anomalies).map(([key, value]) => ({
        aquarium_id: body.aquarium_id,
        alert_timestamp: new Date().toISOString(),
        severity: 'high',
        title: `Anomaly detected in ${key.replace('_', ' ').toUpperCase()}`,
        message: `Detected a significant change in ${key.replace('_', ' ').toUpperCase()} of ${value} units.`,
      })),
    )

    if (insertError) {
      throw new Error("Failed to insert alert into Supabase: " + insertError.message);
    }

    return new Response(JSON.stringify({ anomalies }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Error processing request:", error);

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})