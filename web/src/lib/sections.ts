import type { Task } from "@/types"

export interface TaskGroup {
  key: string
  label: string
  tone?: "danger"
  tasks: Task[]
}

function scheduledTime(t: Task): number {
  return new Date(t.remindAt ?? t.dueAt ?? t.createdAt).getTime()
}

/**
 * Buckets tasks into ordered sections: Overdue, Today, Upcoming, Someday and
 * Completed. Empty sections are omitted.
 */
export function groupTasks(tasks: Task[]): TaskGroup[] {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const startOfTomorrow = new Date(startOfToday)
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1)

  const overdue: Task[] = []
  const today: Task[] = []
  const upcoming: Task[] = []
  const someday: Task[] = []
  const completed: Task[] = []

  for (const task of tasks) {
    if (task.completedAt != null) {
      completed.push(task)
      continue
    }
    const when = task.remindAt ?? task.dueAt
    if (!when) {
      someday.push(task)
      continue
    }
    const date = new Date(when)
    if (date < startOfToday) overdue.push(task)
    else if (date < startOfTomorrow) today.push(task)
    else upcoming.push(task)
  }

  const byScheduled = (a: Task, b: Task) => scheduledTime(a) - scheduledTime(b)
  overdue.sort(byScheduled)
  today.sort(byScheduled)
  upcoming.sort(byScheduled)
  someday.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )
  completed.sort(
    (a, b) =>
      new Date(b.completedAt ?? b.updatedAt).getTime() -
      new Date(a.completedAt ?? a.updatedAt).getTime(),
  )

  const groups: TaskGroup[] = [
    { key: "overdue", label: "Overdue", tone: "danger", tasks: overdue },
    { key: "today", label: "Today", tasks: today },
    { key: "upcoming", label: "Upcoming", tasks: upcoming },
    { key: "someday", label: "Someday", tasks: someday },
    { key: "completed", label: "Completed", tasks: completed },
  ]

  return groups.filter((group) => group.tasks.length > 0)
}
