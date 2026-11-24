const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const date = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export const formatCurrency = (value: number) => currency.format(value)

/** Formats an ISO date (YYYY-MM-DD) without timezone drift. */
export const formatDate = (iso: string) => date.format(new Date(`${iso}T00:00:00Z`))

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((word) => /^[A-Za-z]/.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}
