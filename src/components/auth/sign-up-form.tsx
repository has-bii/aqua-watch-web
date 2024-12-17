"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeOffIcon, LoaderIcon, LogInIcon } from "lucide-react";
import React from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const FormSchema = z.object({
  full_name: z.string().min(4).max(255),
  email: z.string().email(),
  password: z.string(),
});

export function SignUpForm() {
  const supabase = createClient();
  const [showPass, setShowPass] = React.useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit({
    email,
    full_name,
    password,
  }: z.infer<typeof FormSchema>) {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      form.reset();
      toast.info("Please check your email to confirm");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Unexpected error occurred!");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <div className="w-full space-y-2">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Password"
                      {...field}
                      type={showPass ? "text" : "password"}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0"
                      onClick={() => setShowPass((prev) => !prev)}
                    >
                      {showPass ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="inline-flex w-full justify-end">
          <Link
            href="/auth/forgot"
            className="text-sm font-semibold text-primary underline underline-offset-2"
          >
            Forgot Password
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          Sign up
          {form.formState.isSubmitting ? (
            <LoaderIcon className="animate-spin" />
          ) : (
            <LogInIcon />
          )}
        </Button>
      </form>
    </Form>
  );
}
