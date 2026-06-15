import { ListTodo, StickyNote, Wallet } from "lucide-react"

import type { ModuleDef } from "@/types"

export const MODULES: ModuleDef[] = [
  { id: "tasks", label: "Tasks", icon: ListTodo, hue: "tasks", available: true },
  { id: "notes", label: "Notes", icon: StickyNote, hue: "notes", available: false },
  { id: "finance", label: "Finance", icon: Wallet, hue: "finance", available: false },
]
