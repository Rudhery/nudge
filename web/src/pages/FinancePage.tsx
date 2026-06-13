import { Wallet } from "lucide-react"

import { ComingSoon } from "@/components/layout/ComingSoon"

export function FinancePage() {
  return (
    <ComingSoon
      icon={Wallet}
      hue="finance"
      title="Finance"
      description="Track expenses and income at a glance, with gentle nudges before bills are due."
    />
  )
}
