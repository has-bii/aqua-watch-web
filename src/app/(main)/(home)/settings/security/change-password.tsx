import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import TSupabaseClient from "@/lib/supabase"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader, SaveIcon } from "lucide-react"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

type Props = {
  supabase: TSupabaseClient
}

const formSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters long").trim(),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long").trim(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export default function ChangePassword({ supabase }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { error } = await supabase.auth.updateUser({
      password: data.newPassword,
    })

    if (error) {
      toast.error("Failed to update password. Please try again.")
      return
    }

    toast.success("Password updated successfully!")
    form.reset({ newPassword: "", confirmPassword: "" })
  }

  const { isSubmitting, isValid, isDirty } = form.formState

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-xl flex flex-col space-y-4">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="ml-auto" disabled={!isValid || !isDirty || isSubmitting}>
          {isSubmitting ? <Loader className="animate-spin" /> : <SaveIcon />}
          <span>Change Password</span>
        </Button>
      </form>
    </Form>
  )
}
