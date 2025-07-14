"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useSupabase from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useCallback } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
})

export default function LoginPage() {
  const supabase = useSupabase()
  const router = useRouter()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = useCallback(async (data: z.infer<typeof loginSchema>) => {
    const { error } = await supabase.auth.signInWithPassword({
      ...data,
    })

    if (error) {
      toast.error(`Login failed: ${error.message}`)
      return
    }

    toast.success("Login successful!")
    router.refresh()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { isSubmitting } = form.formState

  return (
    <>
      {/* Header */}
      <div className="mb-4 space-y-1 text-center">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-muted-foreground text-pretty text-sm">
          Enter your email and password to sign in to your account.
        </p>
      </div>

      {/* form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="me@example.com" {...field} />
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
                  <Input placeholder="password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : <LogIn />}
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </>
  )
}
