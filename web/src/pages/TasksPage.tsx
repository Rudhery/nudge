import { useState } from "react"
import { Bell, Loader2 } from "lucide-react"

import { QuickAdd } from "@/components/tasks/QuickAdd"
import { TaskSections } from "@/components/tasks/TaskSections"
import { TaskSheet } from "@/components/tasks/TaskSheet"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTasks } from "@/hooks/use-tasks"
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
      <circle cx="32" cy="32" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
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
  const { tasks, loading, error, reload, addTask, updateTask, toggleComplete, removeTask } =
    useTasks()
  const [editing, setEditing] = useState<Task | null>(null)

  const now = new Date()
  const dateLabel = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  const total = tasks.length
  const done = tasks.filter((t) => t.completedAt != null).length
  const pending = total - done
  const reminders = tasks.filter((t) => t.remindAt != null && t.completedAt == null).length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="space-y-6">
      <header className="animate-rise">
        <p className="text-sm font-medium text-muted-foreground">{dateLabel}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-balance md:text-[2.1rem]">
          {greetingFor(now)}, <span className="italic text-primary">{NAME}</span>
        </h1>
        <p className="mt-1.5 text-[15px] text-muted-foreground">
          {pending === 0
            ? "You're all caught up."
            : `${pending} ${pending === 1 ? "task" : "tasks"} left today`}
          {reminders > 0 &&
            ` · ${reminders} ${reminders === 1 ? "nudge" : "nudges"} scheduled`}
        </p>
      </header>

      <Card className="animate-rise overflow-hidden" style={{ animationDelay: "70ms" }}>
        <div className="flex items-center gap-5 p-5">
          <div className="relative grid shrink-0 place-items-center">
            <ProgressRing value={total === 0 ? 0 : done / total} />
            <span className="absolute text-sm font-semibold tabular-nums">{pct}%</span>
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
              {reminders} {reminders === 1 ? "reminder" : "reminders"} today
            </div>
          </div>
        </div>
      </Card>

      <section className="animate-rise" style={{ animationDelay: "140ms" }}>
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading ? (
          <LoadingState />
        ) : (
          <TaskSections
            tasks={tasks}
            onToggle={(task) => void toggleComplete(task)}
            onEdit={setEditing}
          />
        )}
      </section>

      <div className="animate-rise" style={{ animationDelay: "200ms" }}>
        <QuickAdd onAdd={addTask} />
      </div>

      <TaskSheet
        task={editing}
        open={editing != null}
        onOpenChange={(o) => {
          if (!o) setEditing(null)
        }}
        onSave={updateTask}
        onDelete={removeTask}
      />
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-12 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      Loading tasks…
    </div>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-destructive/40 bg-destructive/5 py-10 text-center">
      <p className="px-4 text-sm text-muted-foreground">
        Couldn&apos;t load tasks: {message}
      </p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}
