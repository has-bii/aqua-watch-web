import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
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
  contamination_rate?: number
  anomaly_parameters?: string[] | null
}

const formSchema = z.object({
  contamination_rate: z
    .number()
    .min(0.01, "Contamination rate must be at least 0.01")
    .max(0.5, "Contamination rate must be at most 0.5"),
  detect_temperature: z.boolean(),
  detect_ph: z.boolean(),
  detect_do: z.boolean(),
})

export default function SettingAquariumAnomaly({
  supabase,
  aquarium_id,
  contamination_rate,
  anomaly_parameters,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contamination_rate: contamination_rate || 0.1,
      detect_temperature: anomaly_parameters?.includes("water_temperature") ?? true,
      detect_ph: anomaly_parameters?.includes("ph") ?? true,
      detect_do: anomaly_parameters?.includes("do") ?? true,
    },
    mode: "onChange",
  })

  React.useEffect(() => {
    if (contamination_rate === undefined || !anomaly_parameters) return

    form.reset({
      contamination_rate,
      detect_temperature: anomaly_parameters.includes("water_temperature"),
      detect_ph: anomaly_parameters.includes("ph"),
      detect_do: anomaly_parameters.includes("do"),
    })
  }, [contamination_rate, anomaly_parameters, form])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Build anomaly parameters array based on switches
    const anomalyParams: string[] = []
    if (data.detect_temperature) anomalyParams.push("water_temperature")
    if (data.detect_ph) anomalyParams.push("ph")
    if (data.detect_do) anomalyParams.push("do")

    const { error } = await supabase
      .from("aquarium_settings")
      .update({
        contamination_rate: data.contamination_rate,
        anomaly_parameters: anomalyParams,
      })
      .eq("aquarium_id", aquarium_id)

    if (error) {
      toast.error("Failed to update anomaly settings. Please try again.")
      return
    }

    toast.success("Anomaly detection settings updated successfully!")
    form.reset({
      contamination_rate: data.contamination_rate,
      detect_temperature: data.detect_temperature,
      detect_ph: data.detect_ph,
      detect_do: data.detect_do,
    })
  }

  const { isSubmitting, isValid, isDirty } = form.formState

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-xl flex flex-col space-y-4">
        <FormField
          control={form.control}
          name="contamination_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contamination Rate</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="0.5"
                  placeholder="0.1"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <div className="text-muted-foreground text-sm">
                Expected contamination rate for anomaly detection (0.01 - 0.5)
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="detect_temperature"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Water Temperature Anomaly Detection</FormLabel>
                <div className="text-muted-foreground text-sm">
                  Enable anomaly detection for water temperature readings
                </div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="detect_ph"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">pH Level Anomaly Detection</FormLabel>
                <div className="text-muted-foreground text-sm">Enable anomaly detection for pH level readings</div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="detect_do"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Dissolved Oxygen Anomaly Detection</FormLabel>
                <div className="text-muted-foreground text-sm">
                  Enable anomaly detection for dissolved oxygen readings
                </div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="ml-auto" disabled={!isValid || !isDirty || isSubmitting}>
          {isSubmitting ? <Loader className="animate-spin" /> : <SaveIcon />}
          <span>Update Anomaly Settings</span>
        </Button>
      </form>
    </Form>
  )
}
