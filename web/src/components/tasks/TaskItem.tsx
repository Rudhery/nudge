import { motion, type PanInfo } from "framer-motion"
import { Bell, Check, Clock, Trash2 } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { timeLabel } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Priority, Task } from "@/types"

const priorityStyles: Record<Priority, { dot: string; label: string }> = {
  high: { dot: "bg-destructive", label: "High" },
  medium: { dot: "bg-primary", label: "Medium" },
  low: { dot: "bg-muted-foreground/50", label: "Low" },
}

const SWIPE_THRESHOLD = 80

export function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task
  onToggle: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}) {
  const p = priorityStyles[task.priority]
  const done = task.completedAt != null
  const remind = task.remindAt != null
  const due = timeLabel(task.dueAt ?? task.remindAt)

  function handleDragEnd(_event: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD) onToggle(task)
    else if (info.offset.x < -SWIPE_THRESHOLD) onDelete(task)
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="relative overflow-hidden rounded-lg">
        {/* Swipe actions revealed behind the card */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between">
          <div className="flex h-full items-center bg-emerald-500 px-5 text-white">
            <Check className="size-5" />
          </div>
          <div className="flex h-full items-center bg-destructive px-5 text-destructive-foreground">
            <Trash2 className="size-5" />
          </div>
        </div>

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          dragDirectionLock
          dragSnapToOrigin
          onDragEnd={handleDragEnd}
          className="relative flex cursor-grab items-center gap-3.5 rounded-lg border border-border/70 bg-card px-4 py-3.5 shadow-soft transition-[border-color,box-shadow] hover:border-border hover:shadow-lift active:cursor-grabbing"
        >
          <Checkbox
            checked={done}
            onCheckedChange={() => onToggle(task)}
            aria-label={done ? "Mark as not done" : "Mark as done"}
          />
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="min-w-0 flex-1 rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
          >
            <p
              className={cn(
                "truncate text-[15px] font-medium leading-tight transition-colors",
                done && "text-muted-foreground line-through",
              )}
            >
              {task.title}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className={cn("size-1.5 rounded-full", p.dot)} />
                {p.label}
              </span>
              {due && (
                <>
                  <span className="text-border">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" />
                    {due}
                  </span>
                </>
              )}
              {remind && (
                <span className="inline-flex items-center gap-1 font-medium text-primary">
                  <Bell className="size-3" />
                  Nudge
                </span>
              )}
            </div>
          </button>
        </motion.div>
      </div>
    </motion.li>
  )
}
