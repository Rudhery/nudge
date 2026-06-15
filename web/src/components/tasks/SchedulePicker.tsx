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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"
import { presets, scheduleLabel } from "@/lib/schedule"
import { cn } from "@/lib/utils"

function pad(n: number): string {
  return n.toString().padStart(2, "0")
}

function defaultTime(): Date {
  const d = new Date()
  d.setHours(9, 0, 0, 0)
  return d
}

export function SchedulePicker({
  value,
  onChange,
}: {
  value: Date | null
  onChange: (date: Date | null) => void
}) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const close = () => setOpen(false)

  const trigger = (
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
  )

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          align="end"
          className="max-h-[min(70vh,34rem)] w-auto overflow-y-auto p-3"
        >
          <ScheduleFields value={value} onChange={onChange} onClose={close} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] overflow-y-auto rounded-t-2xl px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="font-display">Schedule reminder</SheetTitle>
          <SheetDescription className="sr-only">
            Pick a date and time for the reminder.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <ScheduleFields value={value} onChange={onChange} onClose={close} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

function ScheduleFields({
  value,
  onChange,
  onClose,
}: {
  value: Date | null
  onChange: (date: Date | null) => void
  onClose: () => void
}) {
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
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {presets().map((preset) => (
          <Button
            key={preset.label}
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => {
              onChange(preset.date())
              onClose()
            }}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="flex justify-center border-t border-border pt-2">
        <Calendar mode="single" selected={value ?? undefined} onSelect={pickDay} initialFocus />
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="time"
          value={timeValue}
          onChange={(e) => setTime(e.target.value)}
          aria-label="Reminder time"
          className="h-10"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 gap-1.5 text-muted-foreground"
            onClick={() => {
              onChange(null)
              onClose()
            }}
          >
            <X className="size-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
