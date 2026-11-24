import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  CircleDotIcon,
  ClockIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { ProjectStatus } from "@/lib/projects"

export const statusMeta: Record<
  ProjectStatus,
  {
    label: string
    icon: React.ComponentType
    variant: "default" | "secondary" | "outline" | "destructive"
  }
> = {
  active: { label: "Active", icon: CircleDotIcon, variant: "secondary" },
  completed: { label: "Completed", icon: CheckCircle2Icon, variant: "outline" },
  pending: { label: "Pending", icon: ClockIcon, variant: "outline" },
  delayed: { label: "Delayed", icon: AlertTriangleIcon, variant: "destructive" },
}

/** Status is always icon + label, never color alone. */
export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const { label, icon: Icon, variant } = statusMeta[status]
  return (
    <Badge variant={variant} data-status={status}>
      <Icon />
      {label}
    </Badge>
  )
}
