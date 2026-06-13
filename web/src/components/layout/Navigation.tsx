import { motion } from "framer-motion"
import { Bell, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MODULES } from "@/lib/modules"
import { cn } from "@/lib/utils"
import type { Theme } from "@/hooks/use-theme"
import type { ModuleId } from "@/types"

interface NavProps {
  active: ModuleId
  onSelect: (id: ModuleId) => void
}

const spring = { type: "spring", stiffness: 420, damping: 34 } as const

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-9 place-items-center rounded-xl bg-foreground shadow-soft">
        <Bell className="size-[18px] text-primary" />
      </div>
      {!compact && (
        <span className="font-display text-xl font-semibold tracking-tight">
          Nudge
        </span>
      )}
    </div>
  )
}

export function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: Theme
  onToggle: () => void
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      aria-label="Toggle color theme"
      className="size-9 rounded-lg text-muted-foreground hover:text-foreground"
    >
      {theme === "dark" ? (
        <Sun className="size-[18px]" />
      ) : (
        <Moon className="size-[18px]" />
      )}
    </Button>
  )
}

export function Sidebar({
  active,
  onSelect,
  theme,
  onToggleTheme,
}: NavProps & { theme: Theme; onToggleTheme: () => void }) {
  return (
    <aside className="hidden w-[264px] shrink-0 flex-col border-r border-border/70 bg-card/40 px-4 py-6 backdrop-blur-sm md:flex">
      <div className="px-2">
        <Brand />
      </div>

      <nav className="mt-9 flex flex-col gap-1.5">
        {MODULES.map((m) => {
          const isActive = active === m.id
          const Icon = m.icon
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                !isActive && "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
              style={isActive ? { color: `hsl(var(--${m.hue}))` } : undefined}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebarActive"
                  className="absolute inset-0 rounded-lg"
                  style={{ backgroundColor: `hsl(var(--${m.hue}) / 0.14)` }}
                  transition={spring}
                />
              )}
              <Icon className="relative z-10 size-[18px]" />
              <span className="relative z-10">{m.label}</span>
              {!m.available && (
                <span className="relative z-10 ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Soon
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto flex items-center justify-between px-2">
        <span className="text-xs text-muted-foreground">Self-hosted</span>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </aside>
  )
}

export function BottomNav({ active, onSelect }: NavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/80 pb-safe backdrop-blur-lg md:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {MODULES.map((m) => {
          const isActive = active === m.id
          const Icon = m.icon
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className="relative flex flex-1 flex-col items-center gap-1 px-2 pb-2 pt-3 text-[11px] font-medium"
              style={{ color: isActive ? `hsl(var(--${m.hue}))` : undefined }}
            >
              {isActive && (
                <motion.span
                  layoutId="bottomActive"
                  className="absolute inset-x-4 top-0 h-0.5 rounded-full"
                  style={{ backgroundColor: `hsl(var(--${m.hue}))` }}
                  transition={spring}
                />
              )}
              <Icon
                className={cn(
                  "size-5 transition-colors",
                  !isActive && "text-muted-foreground",
                )}
              />
              <span className={cn(!isActive && "text-muted-foreground")}>
                {m.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
