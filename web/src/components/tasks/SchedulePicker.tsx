import { useState } from "react"
import { CalendarClock, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { presets, scheduleLabel } from "@/lib/schedule"
import { cn } from "@/lib/utils"

function pad(n: number): string {
  return n.toString().padStart(2, "0")
}

export function SchedulePicker({
  value,
  onChange,
}: {
  value: Date | null
  onChange: (date: Date | null) => void
}) {
  const [open, setOpen] = useState(false)

  function pickDay(day?: Date) {
    if (!day) return
    const next = new Date(day)
    const ref = value ?? defaultTime()
    next.setHours(ref.getHours(), ref.getMinutes(), 0, 0)
    onChange(next)
  }

  function setTime(raw: string) {
    const [h, m] = raw.split(":").map(Number)
    const base = value ? new Date(value) : new Date()
    base.setHours(h || 0, m || 0, 0, 0)
    onChange(base)
  }

  const timeValue = value ? `${pad(value.getHours())}:${pad(value.getMinutes())}` : ""

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={value ? "secondary" : "outline"}
          className={cn("h-11 shrink-0 gap-1.5 px-3", value && "text-primary")}
          aria-label="Schedule a reminder"
        >
          <CalendarClock className="size-4" />
          {value && (
            <span className="max-w-[7.5rem] truncate text-xs font-medium">
              {scheduleLabel(value)}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-3">
        <div className="flex flex-col gap-1">
          {presets().map((preset) => (
            <Button
              key={preset.label}
              type="button"
              variant="ghost"
              size="sm"
              className="justify-start font-normal"
              onClick={() => {
                onChange(preset.date())
                setOpen(false)
              }}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        <div className="my-2 border-t border-border" />

        <Calendar mode="single" selected={value ?? undefined} onSelect={pickDay} initialFocus />

        <div className="mt-2 flex items-center gap-2">
          <Input
            type="time"
            value={timeValue}
            onChange={(e) => setTime(e.target.value)}
            aria-label="Reminder time"
            className="h-9"
          />
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 shrink-0"
              aria-label="Clear reminder"
              onClick={() => {
                onChange(null)
                setOpen(false)
              }}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function defaultTime(): Date {
  const d = new Date()
  d.setHours(9, 0, 0, 0)
  return d
}
