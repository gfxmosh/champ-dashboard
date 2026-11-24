"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  BarChart3Icon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  Settings2Icon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react"

// Placeholder navigation and user until auth/data are wired up.
const data = {
  user: {
    name: "Champ User",
    email: "user@example.com",
    avatar: "",
  },
  teams: [
    {
      name: "Champ",
      logo: <TrophyIcon />,
      plan: "Workspace",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: <FolderKanbanIcon />,
    },
    {
      title: "Customers",
      url: "#",
      icon: <UsersIcon />,
      items: [
        { title: "All customers", url: "#" },
        { title: "Segments", url: "#" },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: <BarChart3Icon />,
      items: [
        { title: "Revenue", url: "#" },
        { title: "Usage", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
