import type { ReactNode } from "react"

import {
  Brand,
  BottomNav,
  Sidebar,
  ThemeToggle,
} from "@/components/layout/Navigation"
import type { Theme } from "@/hooks/use-theme"
import type { ModuleId } from "@/types"

interface AppShellProps {
  active: ModuleId
  onSelect: (id: ModuleId) => void
  theme: Theme
  onToggleTheme: () => void
  children: ReactNode
}

export function AppShell({
  active,
  onSelect,
  theme,
  onToggleTheme,
  children,
}: AppShellProps) {
  return (
    <div className="relative z-10 flex h-full overflow-hidden">
      <Sidebar
        active={active}
        onSelect={onSelect}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <main className="h-full flex-1 overflow-y-auto">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-background/80 px-5 py-3 backdrop-blur-md md:hidden">
          <Brand />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </header>

        <div className="mx-auto w-full max-w-2xl px-5 pb-28 pt-6 md:px-8 md:pb-14 md:pt-10">
          {children}
        </div>
      </main>

      <BottomNav active={active} onSelect={onSelect} />
    </div>
  )
}
