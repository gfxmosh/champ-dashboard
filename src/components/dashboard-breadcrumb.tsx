"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const titles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/projects": "Projects",
}

export function DashboardBreadcrumb() {
  const pathname = usePathname()
  const current = titles[pathname] ?? "Overview"
  const isRoot = pathname === "/dashboard"

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {!isRoot && (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
