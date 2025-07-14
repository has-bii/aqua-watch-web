import TSupabaseClient from "@/lib/supabase"
import { memo, useCallback, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Database } from "@/types/database"
import { useQueryClient } from "@tanstack/react-query"

type WaterChangeDialogProps = {
  aquarium_id: string
  supabase: TSupabaseClient
}

type WaterChangeData = Database["public"]["Tables"]["water_changing_times"]["Row"]

const formSchema = z.object({
  percentage_changed: z
    .string()
    .trim()
    .min(1, "Percentage changed is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Percentage must be a number",
    }),
  volume_changed_liters: z
    .string()
    .trim()
    .min(1, "Volume changed is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Volume must be a number",
    }),
  water_temperature_added: z
    .string()
    .trim()
    .min(1, "Water temperature is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Temperature must be a number",
    }),
})

const WaterChangeDialog = memo(function WaterChangeDialog({ aquarium_id, supabase }: WaterChangeDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      percentage_changed: "",
      volume_changed_liters: "",
      water_temperature_added: "",
    },
  })

  const onSubmit = useCallback(
    (payload: z.infer<typeof formSchema>) => {
      setIsOpen(false)

      toast.promise<WaterChangeData>(
        new Promise(async (resolve, reject) => {
          const { data, error } = await supabase
            .from("water_changing_times")
            .insert({
              aquarium_id,
              percentage_changed: Number(payload.percentage_changed) / 100,
              volume_changed_liters: Number(payload.volume_changed_liters),
              water_temperature_added: Number(payload.water_temperature_added),
              change_reason: "scheduled",
              changed_at: new Date().toISOString(),
            })
            .select("*")
            .single()

          if (error) {
            reject(error)
          } else {
            resolve(data)
          }
        }),
        {
          loading: "Changing water...",
          success: (data) => {
            form.reset()
            queryClient.invalidateQueries({
              queryKey: ["water-changes", aquarium_id],
            })
            return `Water changed successfully: ${data.percentage_changed * 100}%`
          },
          error: (error) => `Error changing water: ${error.message}`,
        },
      )
    },
    [aquarium_id, form, queryClient, supabase],
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Change Water</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Water for Aquarium</DialogTitle>
          <DialogDescription>
            Are you sure you want to change the water for the aquarium? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            <FormField
              control={form.control}
              name="percentage_changed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentage Changed (%)</FormLabel>
                  <FormControl>
                    <Input placeholder="20%" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="volume_changed_liters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Volume Changed (Liters)</FormLabel>
                  <FormControl>
                    <Input placeholder="1L" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="water_temperature_added"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Water Temperature Added (°C)</FormLabel>
                  <FormControl>
                    <Input placeholder="25°C" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Change Water</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})

export default WaterChangeDialog
