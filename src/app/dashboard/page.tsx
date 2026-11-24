import type { Metadata } from "next"
import { DownloadIcon } from "lucide-react"

import {
  AssistantPanel,
  AssistantSheetTrigger,
} from "@/components/dashboard/assistant-panel"
import { MetricCards } from "@/components/dashboard/metric-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Overview",
}

// All figures come from src/lib/mock-data.ts.
export default function DashboardPage() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
            <p className="text-sm text-muted-foreground">November 2026</p>
          </div>
          <div className="flex gap-2">
            <AssistantSheetTrigger />
            <Button variant="outline">
              <DownloadIcon data-icon="inline-start" />
              Export
            </Button>
          </div>
        </div>
        <MetricCards />
        <RevenueChart />
        <RecentActivity />
      </div>
      <aside className="hidden xl:block" aria-label="AI assistant">
        <AssistantPanel />
      </aside>
    </div>
  )
}
