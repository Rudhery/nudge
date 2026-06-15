import { Toaster as SonnerToaster } from "sonner"

import type { Theme } from "@/hooks/use-theme"

export function Toaster({ theme }: { theme: Theme }) {
  return (
    <SonnerToaster
      theme={theme}
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "rounded-lg border border-border bg-popover text-popover-foreground shadow-lift font-sans",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground rounded-md",
          cancelButton: "bg-muted text-muted-foreground rounded-md",
        },
      }}
    />
  )
}
