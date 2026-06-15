import { useState, type FormEvent } from "react"
import { Loader2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function QuickAdd({
  onAdd,
}: {
  onAdd: (title: string) => void | Promise<void>
}) {
  const [value, setValue] = useState("")
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    const title = value.trim()
    if (!title || busy) return
    setBusy(true)
    try {
      await onAdd(title)
      setValue("")
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a task…  e.g. Call the dentist at 4pm"
        aria-label="Add a task"
        disabled={busy}
      />
      <Button
        type="submit"
        size="icon"
        className="size-11 shrink-0 rounded-md"
        aria-label="Add task"
        disabled={!value.trim() || busy}
      >
        {busy ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Plus className="size-5" />
        )}
      </Button>
    </form>
  )
}
