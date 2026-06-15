import { motion } from "framer-motion"
import { Bell, Clock } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { Priority, Task } from "@/types"

const priorityStyles: Record<Priority, { dot: string; label: string }> = {
  high: { dot: "bg-destructive", label: "High" },
  medium: { dot: "bg-primary", label: "Medium" },
  low: { dot: "bg-muted-foreground/50", label: "Low" },
}

export function TaskItem({
  task,
  onToggle,
}: {
  task: Task
  onToggle: (id: string) => void
}) {
  const p = priorityStyles[task.priority]

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onToggle(task.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onToggle(task.id)
          }
        }}
        className={cn(
          "group flex cursor-pointer select-none items-center gap-3.5 rounded-lg border border-border/70 bg-card px-4 py-3.5 shadow-soft transition-all hover:border-border hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          task.done && "opacity-60",
        )}
      >
        <Checkbox checked={task.done} tabIndex={-1} className="pointer-events-none" />
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-[15px] font-medium leading-tight transition-colors",
              task.done && "text-muted-foreground line-through",
            )}
          >
            {task.title}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <span className={cn("size-1.5 rounded-full", p.dot)} />
              {p.label}
            </span>
            {task.due && (
              <>
                <span className="text-border">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  {task.due}
                </span>
              </>
            )}
            {task.remind && (
              <span className="inline-flex items-center gap-1 font-medium text-primary">
                <Bell className="size-3" />
                Nudge
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.li>
  )
}
