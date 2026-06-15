import { LayoutGroup } from "framer-motion"
import { CalendarCheck } from "lucide-react"

import { TaskItem } from "@/components/tasks/TaskItem"
import { groupTasks } from "@/lib/sections"
import { cn } from "@/lib/utils"
import type { Task } from "@/types"

export function TaskSections({
  tasks,
  onToggle,
  onEdit,
  onDelete,
}: {
  tasks: Task[]
  onToggle: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
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

  const groups = groupTasks(tasks)

  return (
    <LayoutGroup>
      <div className="flex flex-col gap-6">
        {groups.map((group) => (
          <section key={group.key}>
            <div className="mb-2.5 flex items-center gap-2">
              <h3
                className={cn(
                  "text-xs font-semibold uppercase tracking-wide",
                  group.tone === "danger" ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {group.label}
              </h3>
              <span className="text-xs text-muted-foreground tabular-nums">
                {group.tasks.length}
              </span>
            </div>
            <ul className="flex flex-col gap-2.5">
              {group.tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </LayoutGroup>
  )
}
