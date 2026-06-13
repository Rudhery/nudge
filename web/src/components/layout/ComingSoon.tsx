import type { LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export function ComingSoon({
  icon: Icon,
  title,
  description,
  hue,
}: {
  icon: LucideIcon
  title: string
  description: string
  hue: "tasks" | "notes" | "finance"
}) {
  return (
    <div className="flex min-h-[58vh] flex-col items-center justify-center gap-5 text-center animate-rise">
      <div
        className="grid size-16 place-items-center rounded-2xl shadow-soft"
        style={{
          backgroundColor: `hsl(var(--${hue}) / 0.14)`,
          color: `hsl(var(--${hue}))`,
        }}
      >
        <Icon className="size-8" />
      </div>
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="mx-auto max-w-sm text-[15px] text-muted-foreground text-balance">
          {description}
        </p>
      </div>
      <Badge variant="muted">Coming soon</Badge>
    </div>
  )
}
