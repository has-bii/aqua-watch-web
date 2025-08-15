import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "npm:@supabase/supabase-js@2";

import { Bot } from "https://deno.land/x/grammy@v1.36.3/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Authorization, x-client-info, x-api-key, Content-type",
};

const token = Deno.env.get("BOT_TOKEN");
if (!token) throw new Error("BOT_TOKEN is unset");

const bot = new Bot(token);

const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

type Data = {
  acknowledged_at: string | null;
  alert_timestamp: string;
  anomaly_id: number | null;
  id: number;
  is_acknowledged: boolean;
  message: string;
  missing_measurement_id: number | null;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  user_id: string;
};

Deno.serve(async (req) => {
  try {
    const { method } = req;

    if (method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      });
    }

    const payload = await req.json();

    const { title, severity, message, user_id } = payload.record as Data;

    // Get chat id
    const { data: { user } } = await supabaseClient.auth.admin.getUserById(
      user_id,
    );

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    const chatId = user.user_metadata.chat_id;

    if (!chatId) {
      return new Response(
        JSON.stringify({ error: "Chat ID not found for the user" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    let icon = "";

    switch (severity) {
      case "low":
        icon = "🔔";
        break;
      case "medium":
        icon = "⚠️";
        break;
      case "high":
        icon = "🚨";
        break;
      case "critical":
        icon = "❗❗";
        break;
    }

    if (user.user_metadata.enable_notification) {
      // Send notification
      await bot.api.sendMessage(
        chatId,
        `*${icon} ${title} ${icon}*\n\n${message}`,
        {
          parse_mode: "Markdown",
        },
      );
    }

    return new Response(
      JSON.stringify({ message: "Webhook received", payload }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (err: unknown) {
    const error = err as Error;
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
