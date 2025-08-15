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
  aquarium_id: string
  name?: string
  desc?: string | null
}

const formSchema = z.object({
  name: z.string().min(4, "Full name must be at least 4 characters long").trim(),
  desc: z.string().min(10, "Description must be at least 10 characters long").trim(),
})

export default function ChangeAquariumNameDesc({ supabase, desc, name, aquarium_id }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name || "",
      desc: desc || "",
    },
    mode: "onChange",
  })

  React.useEffect(() => {
    if (!name || !desc) return

    form.reset({ name, desc }) // Reset form with the provided name and desc
  }, [desc, form, name])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { error } = await supabase
      .from("aquarium")
      .update({
        name: data.name,
        desc: data.desc,
      })
      .eq("id", aquarium_id)

    if (error) {
      toast.error("Failed to update aquarium. Please try again.")
      return
    }

    toast.success("Aquarium updated successfully!")
    form.reset({ name: data.name, desc: data.desc })
  }

  const { isSubmitting, isValid, isDirty } = form.formState

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-xl flex flex-col space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aquarium Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter aquarium name" {...field} />
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
                <Input placeholder="Enter aquarium description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="ml-auto" disabled={!isValid || !isDirty || isSubmitting}>
          {isSubmitting ? <Loader className="animate-spin" /> : <SaveIcon />}
          <span>Update Aquarium</span>
        </Button>
      </form>
    </Form>
  )
}
