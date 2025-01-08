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
import { useQueryClient } from "@tanstack/react-query";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

const FormSchema = z.object({
  notify_for: z.enum(["anomalies", "nothing"]),
  is_receive_email: z.boolean(),
  is_receive_wa: z.boolean(),
});

type Props = {
  params: Promise<{ ecosystem_slug: string; id: string }>;
};

export default function NotificationSettings({ params }: Props) {
  const { id: env_id } = React.use(params);
  const supabase = createClient();
  const { data: envData, isLoading } = useGetEnvironmentById(supabase, env_id);
  const query = useQueryClient();
  const { mutate, isPending } = useUpdateEnvironment({ query, supabase });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      notify_for: envData?.notify_for ?? "nothing",
      is_receive_email: envData?.is_receive_email ?? false,
      is_receive_wa: envData?.is_receive_wa ?? false,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate({ payload: data, id: env_id });

    form.reset(data);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Configure how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            {/* Notify me */}
            <FormField
              control={form.control}
              name="notify_for"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Notify me about...</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="anomalies" />
                        </FormControl>
                        <FormLabel className="font-normal text-foreground">
                          Anomalies
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="nothing" />
                        </FormControl>
                        <FormLabel className="font-normal text-foreground">
                          Nothing
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Radio */}
            <div>
              <h3 className="mb-4 text-lg font-medium">
                Send Notifications to
              </h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="is_receive_email"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-foreground">Email</FormLabel>
                        <FormDescription>
                          Send notifications to email
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_receive_wa"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-foreground">
                          Whatsapp
                        </FormLabel>
                        <FormDescription>
                          Send notifications to Whatsapp
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
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
