import type { Metadata } from "next"
import { DownloadIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Overview",
}

export default function DashboardPage() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <DownloadIcon />
            Export
          </Button>
          <Button>
            <PlusIcon />
            New report
          </Button>
        </div>
      </div>
      {/* Placeholder regions; replaced by real widgets later. */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50" />
    </>
  )
}
