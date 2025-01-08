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
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  desc: z.string(),
  env_type: z.enum(["aquarium", "pond"]),
});

type Props = {
  params: Promise<{ ecosystem_slug: string; id: string }>;
};

export default function Settings({ params }: Props) {
  const { id: env_id } = React.use(params);
  const supabase = createClient();
  const { data: envData, isLoading } = useGetEnvironmentById(supabase, env_id);
  const query = useQueryClient();
  const { mutate, isPending } = useUpdateEnvironment({ query, supabase });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      name: envData?.name ?? "",
      desc: envData?.desc ?? "",
      env_type: envData?.env_type ?? "aquarium",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate({ payload: data, id: env_id });

    form.reset(data);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>General</CardTitle>
        <CardDescription>
          Manage your aquarium&apos;s general information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aquarium/Pond Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Goldfish Aquarium" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is aquarium/pond display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="env_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="capitalize">
                      <SelectItem value="aquarium">aquarium</SelectItem>
                      <SelectItem value="pond">pond</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Desc */}
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your aquarium"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
