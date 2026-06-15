import { StickyNote } from "lucide-react"

import { ComingSoon } from "@/components/layout/ComingSoon"

export function NotesPage() {
  return (
    <ComingSoon
      icon={StickyNote}
      hue="notes"
      title="Notes"
      description="Quick personal notes — capture a thought and keep it close. This module is next on the roadmap."
    />
  )
}
