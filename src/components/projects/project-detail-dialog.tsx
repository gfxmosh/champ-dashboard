"use client"

import { CheckCircle2Icon, CircleIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { Project } from "@/lib/projects"

import { formatCurrency, formatDate, initials } from "@/lib/format"
import { ProjectStatusBadge } from "./project-status-badge"

export function ProjectDetailDialog({
  project,
  onOpenChange,
}: {
  project: Project | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={project !== null} onOpenChange={onOpenChange}>
      {project && (
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                {project.id}
              </span>
              <ProjectStatusBadge status={project.status} />
            </div>
            <DialogTitle>{project.name}</DialogTitle>
            <DialogDescription>{project.description}</DialogDescription>
          </DialogHeader>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <Detail label="Client" value={project.client} />
            <Detail label="Owner" value={project.owner} />
            <Detail label="Start date" value={formatDate(project.startDate)} />
            <Detail label="Due date" value={formatDate(project.dueDate)} />
            <Detail label="Budget" value={formatCurrency(project.budget)} />
            <Detail
              label="Spent"
              value={`${formatCurrency(project.spent)} (${Math.round(
                (project.spent / project.budget) * 100,
              )}%)`}
            />
          </dl>

          <div className="grid gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="tabular-nums text-muted-foreground">
                {project.progress}%
              </span>
            </div>
            <Progress
              value={project.progress}
              aria-label={`${project.name} progress`}
            />
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <section className="grid content-start gap-2">
              <h3 className="text-sm font-medium">Milestones</h3>
              <ul className="grid gap-1.5 text-sm">
                {project.milestones.map((m) => (
                  <li key={m.title} className="flex items-center gap-2">
                    {m.done ? (
                      <CheckCircle2Icon className="size-4 shrink-0 text-foreground" />
                    ) : (
                      <CircleIcon className="size-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className={m.done ? "" : "text-muted-foreground"}>
                      {m.title}
                      <span className="sr-only">
                        {m.done ? " (done)" : " (not done)"}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="grid content-start gap-2">
              <h3 className="text-sm font-medium">Team</h3>
              <ul className="grid gap-2 text-sm">
                {project.team.map((member) => (
                  <li key={member} className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarFallback>{initials(member)}</AvatarFallback>
                    </Avatar>
                    {member}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-0.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}
