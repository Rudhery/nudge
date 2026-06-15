import type { LucideIcon } from "lucide-react"

export type Priority = "low" | "medium" | "high"

export type ModuleId = "tasks" | "notes" | "finance"

/** Mirrors the server's Task JSON (see server/internal/task). */
export interface Task {
  id: string
  title: string
  notes?: string
  priority: Priority
  dueAt?: string | null
  remindAt?: string | null
  remindedAt?: string | null
  completedAt?: string | null
  createdAt: string
  updatedAt: string
}

/** Payload for creating a task. */
export interface NewTask {
  title: string
  notes?: string
  priority?: Priority
  dueAt?: string | null
  remindAt?: string | null
}

/** Partial update payload. */
export interface TaskPatch {
  title?: string
  notes?: string
  priority?: Priority
  dueAt?: string | null
  remindAt?: string | null
  completed?: boolean
}

export interface ModuleDef {
  id: ModuleId
  label: string
  icon: LucideIcon
  /** CSS variable name for the module accent hue (see index.css). */
  hue: "tasks" | "notes" | "finance"
  available: boolean
}
