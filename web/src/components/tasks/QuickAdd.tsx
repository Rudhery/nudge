import { useState, type FormEvent } from "react"
import { Loader2, Plus } from "lucide-react"

import { SchedulePicker } from "@/components/tasks/SchedulePicker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { parseSchedule } from "@/lib/schedule"
import type { NewTask } from "@/types"

export function QuickAdd({
  onAdd,
}: {
  onAdd: (input: NewTask) => void | Promise<void>
}) {
  const [value, setValue] = useState("")
  const [date, setDate] = useState<Date | null>(null)
  const [pickedManually, setPickedManually] = useState(false)
  const [busy, setBusy] = useState(false)

  function handleChange(text: string) {
    setValue(text)
    // Live natural-language parsing — until the user picks a date by hand.
    if (!pickedManually) {
      setDate(parseSchedule(text).date)
    }
  }

  function handlePick(next: Date | null) {
    setDate(next)
    setPickedManually(true)
  }

  function reset() {
    setValue("")
    setDate(null)
    setPickedManually(false)
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    const title = (pickedManually ? value : parseSchedule(value).title).trim()
    if (!title || busy) return
    setBusy(true)
    try {
      await onAdd({ title, remindAt: date ? date.toISOString() : null })
      reset()
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Add a task…  try “pay rent tomorrow 9am”"
        aria-label="Add a task"
        disabled={busy}
        className="min-w-0 flex-1"
      />
      <SchedulePicker value={date} onChange={handlePick} />
      <Button
        type="submit"
        size="icon"
        className="size-11 shrink-0 rounded-md"
        aria-label="Add task"
        disabled={!value.trim() || busy}
      >
        {busy ? <Loader2 className="size-5 animate-spin" /> : <Plus className="size-5" />}
      </Button>
    </form>
  )
}
