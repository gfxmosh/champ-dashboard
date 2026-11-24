// Dummy project data plus the pure search / filter / sort logic used by the
// projects screen. Kept dependency-free so it can be unit tested with node:test.

export const PROJECT_STATUSES = [
  "active",
  "completed",
  "pending",
  "delayed",
] as const

export type ProjectStatus = (typeof PROJECT_STATUSES)[number]
export type StatusFilter = ProjectStatus | "all"

export const SORT_OPTIONS = [
  { value: "due-asc", label: "Due date (soonest)" },
  { value: "due-desc", label: "Due date (latest)" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "progress-desc", label: "Progress (high–low)" },
  { value: "budget-desc", label: "Budget (high–low)" },
] as const

export type SortOption = (typeof SORT_OPTIONS)[number]["value"]

export type Project = {
  id: string
  name: string
  client: string
  owner: string
  status: ProjectStatus
  /** 0–100 */
  progress: number
  /** USD */
  budget: number
  /** USD */
  spent: number
  /** ISO date (YYYY-MM-DD) */
  startDate: string
  /** ISO date (YYYY-MM-DD) */
  dueDate: string
  description: string
  team: string[]
  milestones: { title: string; done: boolean }[]
}

export const projects: Project[] = [
  {
    id: "PRJ-1024",
    name: "Customer Portal Redesign",
    client: "Northwind Labs",
    owner: "Priya Raman",
    status: "active",
    progress: 62,
    budget: 48000,
    spent: 27400,
    startDate: "2026-08-04",
    dueDate: "2026-12-18",
    description:
      "Rebuild the self-service portal with a new navigation model, saved views and faster account search.",
    team: ["Priya Raman", "Leo Fischer", "Ana Duarte"],
    milestones: [
      { title: "Discovery & research", done: true },
      { title: "Design system update", done: true },
      { title: "Account search rebuild", done: false },
      { title: "Beta rollout", done: false },
    ],
  },
  {
    id: "PRJ-1025",
    name: "Billing Migration",
    client: "Kestrel Freight",
    owner: "Marcus Webb",
    status: "delayed",
    progress: 41,
    budget: 72000,
    spent: 51800,
    startDate: "2026-06-15",
    dueDate: "2026-11-14",
    description:
      "Move invoicing from the legacy billing system to usage-based billing. Blocked on tax provider sign-off.",
    team: ["Marcus Webb", "Grace Okafor"],
    milestones: [
      { title: "Data mapping", done: true },
      { title: "Tax provider integration", done: false },
      { title: "Parallel billing run", done: false },
    ],
  },
  {
    id: "PRJ-1026",
    name: "Onboarding Analytics",
    client: "Brightline Health",
    owner: "Ana Duarte",
    status: "completed",
    progress: 100,
    budget: 18500,
    spent: 17200,
    startDate: "2026-03-02",
    dueDate: "2026-06-30",
    description:
      "Funnel tracking for the first 30 days of a new account, with weekly cohort reports.",
    team: ["Ana Duarte", "Sam Iverson"],
    milestones: [
      { title: "Event taxonomy", done: true },
      { title: "Cohort dashboard", done: true },
      { title: "Handover", done: true },
    ],
  },
  {
    id: "PRJ-1027",
    name: "Mobile App MVP",
    client: "Tidewater Analytics",
    owner: "Leo Fischer",
    status: "pending",
    progress: 0,
    budget: 95000,
    spent: 0,
    startDate: "2027-01-12",
    dueDate: "2027-05-28",
    description:
      "iOS and Android companion app for alerts and approvals. Waiting on contract signature.",
    team: ["Leo Fischer"],
    milestones: [
      { title: "Contract signed", done: false },
      { title: "Prototype", done: false },
      { title: "Store submission", done: false },
    ],
  },
  {
    id: "PRJ-1028",
    name: "SSO & SCIM Rollout",
    client: "Orchard & Co.",
    owner: "Grace Okafor",
    status: "active",
    progress: 78,
    budget: 26000,
    spent: 19900,
    startDate: "2026-09-08",
    dueDate: "2026-12-05",
    description:
      "Enterprise single sign-on with Okta and Entra ID, plus automated user provisioning.",
    team: ["Grace Okafor", "Marcus Webb"],
    milestones: [
      { title: "SAML support", done: true },
      { title: "SCIM provisioning", done: true },
      { title: "Admin audit log", done: false },
    ],
  },
  {
    id: "PRJ-1029",
    name: "Data Warehouse Sync",
    client: "Pinecrest Media",
    owner: "Sam Iverson",
    status: "delayed",
    progress: 23,
    budget: 54000,
    spent: 30100,
    startDate: "2026-07-20",
    dueDate: "2026-10-31",
    description:
      "Nightly export of product data to the client's Snowflake warehouse. Schema changes pushed the timeline.",
    team: ["Sam Iverson", "Priya Raman"],
    milestones: [
      { title: "Connector spike", done: true },
      { title: "Schema v2", done: false },
      { title: "Backfill", done: false },
    ],
  },
  {
    id: "PRJ-1030",
    name: "Support Chatbot",
    client: "Brightline Health",
    owner: "Priya Raman",
    status: "active",
    progress: 35,
    budget: 38000,
    spent: 12600,
    startDate: "2026-10-01",
    dueDate: "2027-02-15",
    description:
      "AI-assisted support widget that answers billing and account questions from the help center.",
    team: ["Priya Raman", "Ana Duarte", "Sam Iverson"],
    milestones: [
      { title: "Knowledge base import", done: true },
      { title: "Escalation flow", done: false },
      { title: "Pilot with 50 accounts", done: false },
    ],
  },
  {
    id: "PRJ-1031",
    name: "Security Audit Remediation",
    client: "Kestrel Freight",
    owner: "Marcus Webb",
    status: "completed",
    progress: 100,
    budget: 22000,
    spent: 23100,
    startDate: "2026-04-06",
    dueDate: "2026-07-17",
    description:
      "Fixes for findings from the annual penetration test, including session hardening and rate limits.",
    team: ["Marcus Webb", "Leo Fischer"],
    milestones: [
      { title: "Critical findings", done: true },
      { title: "High findings", done: true },
      { title: "Retest", done: true },
    ],
  },
  {
    id: "PRJ-1032",
    name: "Reporting API v2",
    client: "Northwind Labs",
    owner: "Ana Duarte",
    status: "pending",
    progress: 5,
    budget: 41000,
    spent: 1800,
    startDate: "2026-12-07",
    dueDate: "2027-03-19",
    description:
      "Versioned public API for reports with pagination, webhooks and per-key rate limits.",
    team: ["Ana Duarte", "Grace Okafor"],
    milestones: [
      { title: "API design review", done: false },
      { title: "Webhooks", done: false },
      { title: "Docs & SDKs", done: false },
    ],
  },
  {
    id: "PRJ-1033",
    name: "Localization (DE, FR, ES)",
    client: "Orchard & Co.",
    owner: "Leo Fischer",
    status: "active",
    progress: 54,
    budget: 15500,
    spent: 8300,
    startDate: "2026-09-21",
    dueDate: "2027-01-09",
    description:
      "Translate the product into German, French and Spanish, including emails and invoices.",
    team: ["Leo Fischer", "Sam Iverson"],
    milestones: [
      { title: "String extraction", done: true },
      { title: "Translation", done: false },
      { title: "QA in-context", done: false },
    ],
  },
  {
    id: "PRJ-1034",
    name: "Usage-Based Pricing Pilot",
    client: "Tidewater Analytics",
    owner: "Grace Okafor",
    status: "completed",
    progress: 100,
    budget: 12000,
    spent: 10400,
    startDate: "2026-05-11",
    dueDate: "2026-08-21",
    description:
      "Three-month pilot of metered pricing for API calls with ten design-partner accounts.",
    team: ["Grace Okafor"],
    milestones: [
      { title: "Metering", done: true },
      { title: "Pilot", done: true },
      { title: "Results review", done: true },
    ],
  },
  {
    id: "PRJ-1035",
    name: "Admin Console Accessibility",
    client: "Pinecrest Media",
    owner: "Sam Iverson",
    status: "pending",
    progress: 0,
    budget: 9000,
    spent: 0,
    startDate: "2027-01-05",
    dueDate: "2027-02-26",
    description:
      "WCAG 2.2 AA fixes across the admin console: focus order, contrast and screen reader labels.",
    team: ["Sam Iverson", "Ana Duarte"],
    milestones: [
      { title: "Audit", done: false },
      { title: "Fixes", done: false },
      { title: "Verification", done: false },
    ],
  },
]

export type ProjectQuery = {
  search: string
  status: StatusFilter
  sort: SortOption
}

export const DEFAULT_QUERY: ProjectQuery = {
  search: "",
  status: "all",
  sort: "due-asc",
}

/** Case-insensitive match on name, client, owner or project ID. */
export function matchesSearch(project: Project, search: string): boolean {
  const q = search.trim().toLowerCase()
  if (!q) return true
  return [project.name, project.client, project.owner, project.id].some(
    (field) => field.toLowerCase().includes(q),
  )
}

const byName = (a: Project, b: Project) => a.name.localeCompare(b.name)

const comparators: Record<SortOption, (a: Project, b: Project) => number> = {
  "due-asc": (a, b) => a.dueDate.localeCompare(b.dueDate) || byName(a, b),
  "due-desc": (a, b) => b.dueDate.localeCompare(a.dueDate) || byName(a, b),
  "name-asc": byName,
  "name-desc": (a, b) => byName(b, a),
  "progress-desc": (a, b) => b.progress - a.progress || byName(a, b),
  "budget-desc": (a, b) => b.budget - a.budget || byName(a, b),
}

/** Search → status filter → sort. Never mutates the input. */
export function queryProjects(
  list: readonly Project[],
  { search, status, sort }: ProjectQuery,
): Project[] {
  return list
    .filter((p) => matchesSearch(p, search))
    .filter((p) => status === "all" || p.status === status)
    .sort(comparators[sort])
}

/** Per-status counts for the current search, used on the filter chips. */
export function countByStatus(
  list: readonly Project[],
  search: string,
): Record<StatusFilter, number> {
  const counts: Record<StatusFilter, number> = {
    all: 0,
    active: 0,
    completed: 0,
    pending: 0,
    delayed: 0,
  }
  for (const p of list) {
    if (!matchesSearch(p, search)) continue
    counts.all++
    counts[p.status]++
  }
  return counts
}

export function isSortOption(value: string): value is SortOption {
  return SORT_OPTIONS.some((o) => o.value === value)
}

export function isStatusFilter(value: string): value is StatusFilter {
  return value === "all" || (PROJECT_STATUSES as readonly string[]).includes(value)
}
