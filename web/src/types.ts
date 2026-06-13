import type { LucideIcon } from "lucide-react"

export type Priority = "low" | "medium" | "high"

export type ModuleId = "tasks" | "notes" | "finance"

export interface Task {
  id: string
  title: string
  /** Human-friendly due time label, e.g. "09:30". */
  due?: string
  priority: Priority
  done: boolean
  /** Whether a WhatsApp nudge is scheduled for this task. */
  remind: boolean
}

export interface ModuleDef {
  id: ModuleId
  label: string
  icon: LucideIcon
  /** CSS variable name for the module accent hue (see index.css). */
  hue: "tasks" | "notes" | "finance"
  available: boolean
}
