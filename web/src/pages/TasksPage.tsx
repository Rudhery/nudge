import { useState } from "react"
import { Bell } from "lucide-react"

import { QuickAdd } from "@/components/tasks/QuickAdd"
import { TaskList } from "@/components/tasks/TaskList"
import { Card } from "@/components/ui/card"
import { initialTasks } from "@/data/tasks"
import type { Task } from "@/types"

const NAME = "Rudhery"

function greetingFor(date: Date): string {
  const h = date.getHours()
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}

function ProgressRing({ value }: { value: number }) {
  const r = 26
  const circumference = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 64 64" className="size-16 -rotate-90">
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth="6"
      />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - value)}
        className="transition-[stroke-dashoffset] duration-500 ease-out"
      />
    </svg>
  )
}

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const now = new Date()
  const dateLabel = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  const total = tasks.length
  const done = tasks.filter((t) => t.done).length
  const pending = total - done
  const reminders = tasks.filter((t) => t.remind && !t.done).length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  function toggle(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  }

  function add(title: string) {
    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        title,
        priority: "medium",
        done: false,
        remind: false,
      },
      ...prev,
    ])
  }

  return (
    <div className="space-y-6">
      <header className="animate-rise">
        <p className="text-sm font-medium text-muted-foreground">{dateLabel}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-balance md:text-[2.1rem]">
          {greetingFor(now)},{" "}
          <span className="italic text-primary">{NAME}</span>
        </h1>
        <p className="mt-1.5 text-[15px] text-muted-foreground">
          {pending === 0
            ? "You're all caught up."
            : `${pending} ${pending === 1 ? "task" : "tasks"} left today`}
          {reminders > 0 &&
            ` · ${reminders} ${reminders === 1 ? "nudge" : "nudges"} scheduled`}
        </p>
      </header>

      <Card
        className="animate-rise overflow-hidden"
        style={{ animationDelay: "70ms" }}
      >
        <div className="flex items-center gap-5 p-5">
          <div className="relative grid shrink-0 place-items-center">
            <ProgressRing value={total === 0 ? 0 : done / total} />
            <span className="absolute text-sm font-semibold tabular-nums">
              {pct}%
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold">
              {total > 0 && done === total ? "All done — nice work." : `${pending} to go`}
            </p>
            <p className="text-sm text-muted-foreground">
              You've completed {done} of {total} tasks.
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
              <Bell className="size-3.5" />
              {reminders} WhatsApp {reminders === 1 ? "nudge" : "nudges"} today
            </div>
          </div>
        </div>
      </Card>

      <section className="animate-rise" style={{ animationDelay: "140ms" }}>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold">Today</h2>
          <span className="text-xs text-muted-foreground tabular-nums">
            {done}/{total} done
          </span>
        </div>
        <TaskList tasks={tasks} onToggle={toggle} />
      </section>

      <div className="animate-rise" style={{ animationDelay: "200ms" }}>
        <QuickAdd onAdd={add} />
      </div>
    </div>
  )
}
