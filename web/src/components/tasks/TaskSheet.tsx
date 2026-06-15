import { useEffect, useState, type ReactNode } from "react"
import { Loader2, Trash2 } from "lucide-react"

import { SchedulePicker } from "@/components/tasks/SchedulePicker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import type { Priority, Task, TaskPatch } from "@/types"

const PRIORITIES: Priority[] = ["low", "medium", "high"]

export function TaskSheet({
  task,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: string, patch: TaskPatch) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [remindAt, setRemindAt] = useState<Date | null>(null)
  const [busy, setBusy] = useState(false)

  // Populate the form when a task is opened. Guarding on `task` keeps the last
  // values during the close animation (no flicker).
  useEffect(() => {
    if (!task) return
    setTitle(task.title)
    setNotes(task.notes ?? "")
    setPriority(task.priority)
    setRemindAt(task.remindAt ? new Date(task.remindAt) : null)
  }, [task])

  async function save() {
    if (!task) return
    const trimmed = title.trim()
    if (!trimmed) return
    setBusy(true)
    try {
      await onSave(task.id, {
        title: trimmed,
        notes,
        priority,
        remindAt: remindAt ? remindAt.toISOString() : null,
      })
      onOpenChange(false)
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!task) return
    setBusy(true)
    try {
      await onDelete(task.id)
      onOpenChange(false)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isDesktop ? "right" : "bottom"}
        className={cn(
          "flex flex-col gap-0",
          isDesktop
            ? "w-full p-6 sm:max-w-md"
            : "max-h-[92vh] rounded-t-2xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]",
        )}
      >
        <SheetHeader className="text-left">
          <SheetTitle className="font-display text-xl">Edit task</SheetTitle>
          <SheetDescription className="sr-only">
            Edit the task's title, notes, priority and reminder.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 flex flex-1 flex-col gap-4 overflow-y-auto">
          <Field label="Title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Title" />
          </Field>

          <Field label="Notes">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add details…"
              rows={3}
              aria-label="Notes"
            />
          </Field>

          <div className="flex flex-wrap items-end gap-4">
            <Field label="Priority" className="min-w-[8rem] flex-1">
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger aria-label="Priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Reminder">
              <SchedulePicker value={remindAt} onChange={setRemindAt} />
            </Field>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
          <Button
            type="button"
            variant="ghost"
            className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={remove}
            disabled={busy}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
          <Button type="button" onClick={save} disabled={busy || !title.trim()}>
            {busy && <Loader2 className="size-4 animate-spin" />}
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function Field({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
