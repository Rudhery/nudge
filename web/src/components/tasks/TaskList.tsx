import { CalendarCheck } from "lucide-react"

import { TaskItem } from "@/components/tasks/TaskItem"
import type { Task } from "@/types"

export function TaskList({
  tasks,
  onToggle,
}: {
  tasks: Task[]
  onToggle: (id: string) => void
}) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-12 text-center">
        <CalendarCheck className="size-7 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Nothing here yet. Add your first task below.
        </p>
      </div>
    )
  }

  // Keep completed tasks at the bottom; layout animation handles the motion.
  const sorted = [...tasks].sort((a, b) => Number(a.done) - Number(b.done))

  return (
    <ul className="flex flex-col gap-2.5">
      {sorted.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} />
      ))}
    </ul>
  )
}
