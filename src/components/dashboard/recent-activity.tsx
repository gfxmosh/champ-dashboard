import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { initials } from "@/lib/format"
import { recentActivity, type ActivityKind } from "@/lib/mock-data"

const kindLabel: Record<ActivityKind, string> = {
  signup: "New",
  upgrade: "Upgrade",
  downgrade: "Downgrade",
  payment: "Payment",
  churn: "Churned",
}

const kindVariant: Record<
  ActivityKind,
  "default" | "secondary" | "outline" | "destructive"
> = {
  signup: "default",
  upgrade: "secondary",
  downgrade: "outline",
  payment: "outline",
  churn: "destructive",
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  signDisplay: "exceptZero",
})

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent customer activity</CardTitle>
        <CardDescription>Plan changes, sign-ups and payments</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {recentActivity.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <Avatar>
                <AvatarFallback>{initials(item.customer)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate font-medium">{item.customer}</span>
                  <Badge variant={kindVariant[item.kind]}>
                    {kindLabel[item.kind]}
                  </Badge>
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {item.detail} · {item.contact}
                </p>
              </div>
              <div className="shrink-0 text-right">
                {item.amount !== undefined && (
                  <div className="text-sm font-medium tabular-nums">
                    {currency.format(item.amount)}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">{item.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
