import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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
  email?: string
}

const formSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }).trim(),
})

export default function ChangeEmail({ supabase, email }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email || "",
    },
    mode: "onChange",
  })

  React.useEffect(() => {
    if (!email) return

    form.reset({ email }) // Reset form with the provided email
  }, [form, email])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { error } = await supabase.auth.updateUser({
      email: data.email,
    })

    if (error) {
      toast.error("Failed to update email. Please check your inbox for confirmation.")
      return
    }

    toast.success("Email update initiated! Please check your inbox to confirm the change.")
    form.reset({ email: data.email })
  }

  const { isSubmitting } = form.formState

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-xl flex flex-col space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email address" disabled {...field} />
              </FormControl>
              <FormDescription>This feature will be available soon.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="ml-auto" disabled>
          {isSubmitting ? <Loader className="animate-spin" /> : <SaveIcon />}
          <span>Change Email</span>
        </Button>
      </form>
    </Form>
  )
}
