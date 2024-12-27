"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InsertEnvironmentSchema } from "@/utils/form/environment-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderIcon, Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAddEnvironment } from "@/hooks/environment";
import { useGetEcosystems } from "@/hooks/ecosystems";

type Props = {
  children: React.ReactNode;
  ecosystem_slug?: string;
};

export default function EnvironmentAdd({ children, ecosystem_slug }: Props) {
  const [open, setOpen] = React.useState(false);
  const supabase = createClient();
  const { data: ecosystems } = useGetEcosystems(supabase);
  const query = useQueryClient();
  const { mutate, isPending } = useAddEnvironment({
    supabase,
    query,
    onSucces: () => setOpen(false),
  });
  const form = useForm<z.infer<typeof InsertEnvironmentSchema>>({
    resolver: zodResolver(InsertEnvironmentSchema),
    defaultValues: {
      name: "",
      ecosystem_slug: ecosystem_slug,
    },
  });

  async function onSubmit(data: z.infer<typeof InsertEnvironmentSchema>) {
    mutate(data);

    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Aquarium</DialogTitle>
          <DialogDescription>
            Create a new aquarium to monitor and manage your aquatic
            environment. Customize its name and details to get started.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Piranha Aquarium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="env_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the type of the invironment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="aquarium">Aquarium</SelectItem>
                        <SelectItem value="pond">Pond</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ecosystem_slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ecosystem</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger disabled={ecosystem_slug !== undefined}>
                          <SelectValue placeholder="Select the ecosystem" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ecosystems?.map((ecosystem, i) => (
                          <SelectItem key={i} value={ecosystem.slug}>
                            {ecosystem.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <LoaderIcon className="animate-spin" /> : <Plus />}
              Add Aquarium
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
