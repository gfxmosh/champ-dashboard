import {
  ActivityIcon,
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  DollarSignIcon,
  UsersIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { metrics, type Metric } from "@/lib/mock-data"

const icons: Record<Metric["id"], React.ComponentType> = {
  revenue: DollarSignIcon,
  customers: UsersIcon,
  retention: ActivityIcon,
}

export function MetricCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = icons[metric.id]
        const up = metric.delta >= 0
        const Trend = up ? ArrowUpRightIcon : ArrowDownRightIcon
        const deltaText = `${up ? "+" : "−"}${Math.abs(metric.delta)}${
          metric.deltaUnit === "%" ? "%" : " pts"
        }`
        return (
          <Card key={metric.id}>
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <span className="text-muted-foreground [&_svg]:size-4">
                  <Icon />
                </span>
                {metric.label}
              </CardDescription>
              <CardTitle className="text-3xl font-semibold tabular-nums">
                {metric.value}
              </CardTitle>
            </CardHeader>
            <CardFooter className="gap-2 text-sm">
              {/* Direction is carried by icon + sign, never color alone. */}
              <Badge variant={up ? "secondary" : "destructive"}>
                <Trend />
                {deltaText}
              </Badge>
              <span className="text-muted-foreground">{metric.comparison}</span>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
