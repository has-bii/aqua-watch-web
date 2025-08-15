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
  full_name?: string
}

const formSchema = z.object({
  full_name: z.string().min(4, "Full name must be at least 4 characters long").trim(),
})

export default function ChangeName({ supabase, full_name }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: full_name || "",
    },
    mode: "onChange",
  })

  React.useEffect(() => {
    if (!full_name) return

    form.reset({ full_name }) // Reset form with the provided full_name
  }, [form, full_name])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: data.full_name },
    })

    if (error) {
      toast.error("Failed to update name. Please try again.")
      return
    }

    toast.success("Name updated successfully!")
    form.reset({ full_name: data.full_name })
  }

  const { isSubmitting, isValid, isDirty } = form.formState

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-xl flex flex-col space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="ml-auto" disabled={!isValid || !isDirty || isSubmitting}>
          {isSubmitting ? <Loader className="animate-spin" /> : <SaveIcon />}
          <span>Change Name</span>
        </Button>
      </form>
    </Form>
  )
}
