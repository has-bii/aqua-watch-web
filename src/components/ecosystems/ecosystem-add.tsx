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
import { Textarea } from "@/components/ui/textarea";
import { LoaderIcon, Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { InsertEcosystemSchema } from "@/utils/form/ecosystem-schema";
import { useAddEcosystem } from "@/hooks/ecosystems";

type Props = {
  children: React.ReactNode;
};

export default function EcosystemAdd({ children }: Props) {
  const [open, setOpen] = React.useState(false);
  const supabase = createClient();
  const query = useQueryClient();
  const { mutate, isPending } = useAddEcosystem({
    supabase,
    query,
    onSucces: () => setOpen(false),
  });
  const form = useForm<z.infer<typeof InsertEcosystemSchema>>({
    resolver: zodResolver(InsertEcosystemSchema),
    defaultValues: {
      name: "",
      desc: "",
      slug: "",
    },
  });

  async function onSubmit(data: z.infer<typeof InsertEcosystemSchema>) {
    mutate(data);

    form.reset();
  }

  const watchName = form.watch("name");

  React.useEffect(() => {
    form.setValue("slug", watchName.replaceAll(" ", "-").toLowerCase());
  }, [form, watchName]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Ecosystem</DialogTitle>
          <DialogDescription>
            Create a new ecosystem before adding an aquarium. Customize its name
            and details to get started.
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
                      <Input placeholder="Aquarium Garden" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="aquarium-garden"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description for the ecosystem"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <LoaderIcon className="animate-spin" /> : <Plus />}
              Add Ecosystem
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
