// Mock data for the dashboard. Replace with real queries once a data source exists.

export type Metric = {
  id: "revenue" | "customers" | "retention"
  label: string
  value: string
  /** Change vs. previous period, in percent (or percentage points for rates). */
  delta: number
  deltaUnit: "%" | "pts"
  comparison: string
}

export const metrics: Metric[] = [
  {
    id: "revenue",
    label: "Monthly revenue",
    value: "$128,450",
    delta: 8.2,
    deltaUnit: "%",
    comparison: "vs. $118,710 in October",
  },
  {
    id: "customers",
    label: "Active customers",
    value: "1,284",
    delta: 4.1,
    deltaUnit: "%",
    comparison: "51 net new this month",
  },
  {
    id: "retention",
    label: "Net retention",
    value: "94.6%",
    delta: -1.3,
    deltaUnit: "pts",
    comparison: "vs. 95.9% in October",
  },
]

export type RevenuePoint = { month: string; revenue: number }

// Trailing 12 months, Dec 2025 – Nov 2026.
export const revenueByMonth: RevenuePoint[] = [
  { month: "Dec 2025", revenue: 84200 },
  { month: "Jan 2026", revenue: 86900 },
  { month: "Feb 2026", revenue: 89400 },
  { month: "Mar 2026", revenue: 93800 },
  { month: "Apr 2026", revenue: 97100 },
  { month: "May 2026", revenue: 99600 },
  { month: "Jun 2026", revenue: 104300 },
  { month: "Jul 2026", revenue: 108900 },
  { month: "Aug 2026", revenue: 111200 },
  { month: "Sep 2026", revenue: 115800 },
  { month: "Oct 2026", revenue: 118710 },
  { month: "Nov 2026", revenue: 128450 },
]

export type ActivityKind = "signup" | "upgrade" | "downgrade" | "payment" | "churn"

export type Activity = {
  id: string
  customer: string
  contact: string
  kind: ActivityKind
  detail: string
  amount?: number
  time: string
}

export const recentActivity: Activity[] = [
  {
    id: "a1",
    customer: "Northwind Labs",
    contact: "Priya Raman",
    kind: "upgrade",
    detail: "Upgraded Growth → Scale",
    amount: 1200,
    time: "12 min ago",
  },
  {
    id: "a2",
    customer: "Brightline Health",
    contact: "Marcus Webb",
    kind: "signup",
    detail: "Started Growth plan",
    amount: 480,
    time: "48 min ago",
  },
  {
    id: "a3",
    customer: "Kestrel Freight",
    contact: "Ana Duarte",
    kind: "payment",
    detail: "Annual invoice paid",
    amount: 14400,
    time: "2 h ago",
  },
  {
    id: "a4",
    customer: "Orchard & Co.",
    contact: "Leo Fischer",
    kind: "downgrade",
    detail: "Downgraded Scale → Growth",
    amount: -720,
    time: "5 h ago",
  },
  {
    id: "a5",
    customer: "Tidewater Analytics",
    contact: "Grace Okafor",
    kind: "signup",
    detail: "Started Starter plan",
    amount: 99,
    time: "Yesterday",
  },
  {
    id: "a6",
    customer: "Pinecrest Media",
    contact: "Sam Iverson",
    kind: "churn",
    detail: "Cancelled subscription",
    amount: -480,
    time: "Yesterday",
  },
]

export const assistantSuggestions = [
  "Why did retention drop?",
  "Summarize revenue growth",
  "Who are my newest customers?",
]

/** Canned assistant replies, matched by keyword. Stand-in for a real model call. */
export function mockAssistantReply(prompt: string): string {
  const q = prompt.toLowerCase()
  if (q.includes("retention") || q.includes("churn")) {
    return "Net retention fell 1.3 pts to 94.6%. Most of the drop comes from two accounts: Pinecrest Media cancelled ($480/mo) and Orchard & Co. downgraded to Growth (−$720/mo). Both were on the Scale plan and had low seat usage last quarter."
  }
  if (q.includes("revenue") || q.includes("growth") || q.includes("mrr")) {
    return "Monthly revenue is $128,450, up 8.2% from October and 53% over the last 12 months. November was the strongest month this year, mainly from Northwind Labs' upgrade and Kestrel Freight's annual renewal."
  }
  if (q.includes("customer") || q.includes("new") || q.includes("signup")) {
    return "You have 1,284 active customers, 51 net new this month. The newest are Brightline Health (Growth, 48 min ago) and Tidewater Analytics (Starter, yesterday)."
  }
  return "I'm running on mock data for now, so I can answer questions about revenue, customers, and retention on this page. Try one of the suggestions below."
}
