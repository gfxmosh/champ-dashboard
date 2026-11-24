"use client"

import * as React from "react"
import { SearchIcon, SearchXIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  countByStatus,
  DEFAULT_QUERY,
  isSortOption,
  isStatusFilter,
  PROJECT_STATUSES,
  projects,
  queryProjects,
  SORT_OPTIONS,
  type Project,
  type ProjectQuery,
} from "@/lib/projects"

import { formatCurrency, formatDate } from "@/lib/format"
import { ProjectDetailDialog } from "./project-detail-dialog"
import { ProjectStatusBadge, statusMeta } from "./project-status-badge"

export function ProjectsTable() {
  const [query, setQuery] = React.useState<ProjectQuery>(DEFAULT_QUERY)
  const [selected, setSelected] = React.useState<Project | null>(null)

  const rows = React.useMemo(() => queryProjects(projects, query), [query])
  const counts = React.useMemo(
    () => countByStatus(projects, query.search),
    [query.search],
  )
  const isFiltered = query.search.trim() !== "" || query.status !== "all"

  const update = (patch: Partial<ProjectQuery>) =>
    setQuery((q) => ({ ...q, ...patch }))

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar: search, status filter, sort — one row on wide screens. */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-72">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Search name, client, owner or ID…"
            aria-label="Search projects"
            className="pl-8"
            data-testid="project-search"
          />
        </div>

        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={query.status}
          onValueChange={(value) => {
            // Radix sends "" when the active item is clicked again; keep a value.
            if (isStatusFilter(value)) update({ status: value })
          }}
          aria-label="Filter by status"
          className="flex-wrap"
        >
          <ToggleGroupItem value="all" data-testid="status-all">
            All
            <Count n={counts.all} />
          </ToggleGroupItem>
          {PROJECT_STATUSES.map((status) => {
            const { label, icon: Icon } = statusMeta[status]
            return (
              <ToggleGroupItem
                key={status}
                value={status}
                data-testid={`status-${status}`}
              >
                <Icon data-icon="inline-start" />
                {label}
                <Count n={counts[status]} />
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>

        <div className="flex items-center gap-2 lg:ml-auto">
          <span className="text-sm text-muted-foreground" id="sort-label">
            Sort by
          </span>
          <Select
            value={query.sort}
            onValueChange={(value) => {
              if (isSortOption(value)) update({ sort: value })
            }}
          >
            <SelectTrigger
              className="w-48"
              aria-labelledby="sort-label"
              data-testid="project-sort"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex min-h-7 items-center gap-2">
        <p
          className="text-sm text-muted-foreground"
          aria-live="polite"
          data-testid="result-count"
        >
          Showing {rows.length} of {projects.length} projects
        </p>
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuery((q) => ({ ...DEFAULT_QUERY, sort: q.sort }))}
            data-testid="clear-filters"
          >
            <XIcon data-icon="inline-start" />
            Clear filters
          </Button>
        )}
      </div>

      <Card className="py-0">
        <CardContent className="px-0">
          {rows.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <SearchXIcon />
                </EmptyMedia>
                <EmptyTitle>No projects found</EmptyTitle>
                <EmptyDescription>
                  Nothing matches your search and status filter.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  variant="outline"
                  onClick={() => setQuery((q) => ({ ...DEFAULT_QUERY, sort: q.sort }))}
                >
                  <XIcon data-icon="inline-start" />
                  Clear filters
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <Table data-testid="projects-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Project</TableHead>
                  <TableHead className="hidden md:table-cell">Client</TableHead>
                  <TableHead className="hidden lg:table-cell">Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden w-40 sm:table-cell">Progress</TableHead>
                  <TableHead className="hidden text-right xl:table-cell">Budget</TableHead>
                  <TableHead className="pr-4 text-right">Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((project) => (
                  <TableRow
                    key={project.id}
                    data-project-id={project.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(project)}
                  >
                    <TableCell className="pl-4">
                      {/* Real button so rows are reachable by keyboard. */}
                      <button
                        type="button"
                        className="text-left font-medium underline-offset-4 outline-none hover:underline focus-visible:underline"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelected(project)
                        }}
                      >
                        {project.name}
                      </button>
                      <div className="font-mono text-xs text-muted-foreground">
                        {project.id}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{project.client}</TableCell>
                    <TableCell className="hidden lg:table-cell">{project.owner}</TableCell>
                    <TableCell>
                      <ProjectStatusBadge status={project.status} />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={project.progress}
                          aria-label={`${project.name} progress`}
                        />
                        <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">
                          {project.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-right tabular-nums xl:table-cell">
                      {formatCurrency(project.budget)}
                    </TableCell>
                    <TableCell className="pr-4 text-right tabular-nums">
                      {formatDate(project.dueDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ProjectDetailDialog
        project={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />
    </div>
  )
}

function Count({ n }: { n: number }) {
  return <span className="text-xs tabular-nums text-muted-foreground">{n}</span>
}
