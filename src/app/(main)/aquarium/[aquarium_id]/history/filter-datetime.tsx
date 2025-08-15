import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import React from "react"

type Props = {
  label: string
  date: Date
  setDate: React.Dispatch<React.SetStateAction<Date>>
}

export default function FilterDateTime({ date, label, setDate }: Props) {
  const [tempDate, setTempDate] = React.useState<Date>(date)
  const [open, setOpen] = React.useState(false)

  // Add debouncing to avoid immediate state updates
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDate(tempDate)
    }, 1000) // Adjust the delay as needed

    return () => clearTimeout(timer)
  }, [tempDate, setDate])

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="from-date-picker" className="px-1">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" id="date-picker" className="w-32 justify-between font-normal">
              {tempDate ? tempDate.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={tempDate}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (date) setTempDate(date)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
        <Input
          type="time"
          step="1"
          value={format(tempDate, "HH:mm")}
          onChange={(e) => {
            const [hours, minutes] = e.target.value.split(":").map(Number)
            const newDate = new Date(tempDate)
            newDate.setHours(hours, minutes, 0, 0)
            setTempDate(newDate)
          }}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  )
}
