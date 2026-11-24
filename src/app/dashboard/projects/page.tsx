import type { Metadata } from "next"

import { ProjectsTable } from "@/components/projects/projects-table"

export const metadata: Metadata = {
  title: "Projects",
}

// Dummy data lives in src/lib/projects.ts.
export default function ProjectsPage() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Track delivery across every client engagement.
        </p>
      </div>
      <ProjectsTable />
    </>
  )
}
