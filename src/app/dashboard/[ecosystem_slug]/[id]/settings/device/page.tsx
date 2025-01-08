"use client";

import React from "react";
import {
  useGetEnvironmentById,
  useUpdateEnvironment,
} from "@/hooks/environment";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  interval: z.string().min(1, "Minimum 1-minute interval!"),
  temp_min: z.string(),
  temp_max: z.string(),
  temp_method: z.enum(["auto", "manual"]),
});

type Props = {
  params: Promise<{ ecosystem_slug: string; id: string }>;
};

export default function DeviceSettings({ params }: Props) {
  const { id: env_id } = React.use(params);
  const supabase = createClient();
  const { data: envData, isLoading } = useGetEnvironmentById(supabase, env_id);
  const query = useQueryClient();
  const { mutate, isPending } = useUpdateEnvironment({ query, supabase });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      interval: envData?.interval.toString() ?? "",
      temp_max: envData?.temp_max?.toString() ?? "",
      temp_min: envData?.temp_min?.toString() ?? "",
      temp_method: envData?.temp_method ?? "auto",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate({
      payload: {
        interval: parseInt(data.interval),
        temp_method: data.temp_method,
        temp_min: data.temp_method === "auto" ? null : parseInt(data.temp_min),
        temp_max: data.temp_method === "auto" ? null : parseInt(data.temp_max),
      },
      id: env_id,
    });

    form.reset(data);
  }

  const method = form.watch("temp_method");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Device Configuration</CardTitle>
        <CardDescription>
          Configure how your device monitors the aquarium/pond
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            {/* Interval */}
            <FormField
              control={form.control}
              name="interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interval</FormLabel>
                  <FormControl>
                    <Input placeholder="1" type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    In how many minutes it stores data
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Temperature Method */}
            <FormField
              control={form.control}
              name="temp_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select a method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="capitalize">
                      <SelectItem value="auto">auto</SelectItem>
                      <SelectItem value="manual">manual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How system detects anomalies
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div
              className={cn(
                "grid-cols-2 gap-4",
                method === "manual" ? "grid" : "hidden",
              )}
            >
              {/* Temp min */}
              <FormField
                control={form.control}
                name="temp_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Temp (°C)</FormLabel>
                    <FormControl>
                      <Input placeholder="24" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Temp min */}
              <FormField
                control={form.control}
                name="temp_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Temp (°C)</FormLabel>
                    <FormControl>
                      <Input placeholder="28" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isPending || isLoading || !form.formState.isDirty}
            >
              Update
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
