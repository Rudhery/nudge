import { useState } from "react"

import { AppShell } from "@/components/layout/AppShell"
import { useTheme } from "@/hooks/use-theme"
import { FinancePage } from "@/pages/FinancePage"
import { NotesPage } from "@/pages/NotesPage"
import { TasksPage } from "@/pages/TasksPage"
import type { ModuleId } from "@/types"

export default function App() {
  const [active, setActive] = useState<ModuleId>("tasks")
  const { theme, toggle } = useTheme()

  return (
    <AppShell
      active={active}
      onSelect={setActive}
      theme={theme}
      onToggleTheme={toggle}
    >
      {active === "tasks" && <TasksPage />}
      {active === "notes" && <NotesPage />}
      {active === "finance" && <FinancePage />}
    </AppShell>
  )
}
