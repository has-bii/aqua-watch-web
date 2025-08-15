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
  train_ph_model_days?: number
  train_temp_model_days?: number
  prediction_parameters?: string[] | null
}

const formSchema = z.object({
  train_ph_model_days: z
    .number()
    .min(1, "pH training days must be at least 1")
    .max(365, "pH training days must be at most 365"),
  train_temp_model_days: z
    .number()
    .min(1, "Temperature training days must be at least 1")
    .max(365, "Temperature training days must be at most 365"),
  predict_ph: z.boolean(),
  predict_temperature: z.boolean(),
})

export default function SettingAquariumPrediction({
  supabase,
  aquarium_id,
  train_ph_model_days,
  train_temp_model_days,
  prediction_parameters,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      train_ph_model_days: train_ph_model_days || 30,
      train_temp_model_days: train_temp_model_days || 30,
      predict_ph: prediction_parameters?.includes("ph") || false,
      predict_temperature: prediction_parameters?.includes("water_temperature") || false,
    },
    mode: "onChange",
  })

  React.useEffect(() => {
    if (train_ph_model_days === undefined || train_temp_model_days === undefined || !prediction_parameters) return

    form.reset({
      train_ph_model_days,
      train_temp_model_days,
      predict_ph: prediction_parameters.includes("ph"),
      predict_temperature: prediction_parameters.includes("water_temperature"),
    })
  }, [train_ph_model_days, train_temp_model_days, prediction_parameters, form])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Build prediction parameters array based on switches
    const predictionParams: ("water_temperature" | "ph")[] = []
    if (data.predict_temperature) predictionParams.push("water_temperature")
    if (data.predict_ph) predictionParams.push("ph")

    const { error } = await supabase
      .from("aquarium_settings")
      .update({
        train_ph_model_days: data.train_ph_model_days,
        train_temp_model_days: data.train_temp_model_days,
        prediction_parameters: predictionParams,
      })
      .eq("aquarium_id", aquarium_id)

    if (error) {
      toast.error("Failed to update prediction settings. Please try again.")
      return
    }

    toast.success("Prediction settings updated successfully!")
    form.reset({
      train_ph_model_days: data.train_ph_model_days,
      train_temp_model_days: data.train_temp_model_days,
      predict_ph: data.predict_ph,
      predict_temperature: data.predict_temperature,
    })
  }

  const { isSubmitting, isValid, isDirty } = form.formState

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-xl flex flex-col space-y-4">
        <FormField
          control={form.control}
          name="train_temp_model_days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temperature Model Training Days</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="30"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="train_ph_model_days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>pH Model Training Days</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="30"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="predict_temperature"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Temperature Prediction</FormLabel>
                <div className="text-muted-foreground text-sm">
                  Enable water temperature predictions for this aquarium
                </div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} disabled />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="predict_ph"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">pH Prediction</FormLabel>
                <div className="text-muted-foreground text-sm">Enable pH level predictions for this aquarium</div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="ml-auto" disabled={!isValid || !isDirty || isSubmitting}>
          {isSubmitting ? <Loader className="animate-spin" /> : <SaveIcon />}
          <span>Update Prediction Settings</span>
        </Button>
      </form>
    </Form>
  )
}
