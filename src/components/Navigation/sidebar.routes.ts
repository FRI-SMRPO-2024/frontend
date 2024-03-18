import { SidebarRoutesType } from "@/types";

export const sidebarRoutes: SidebarRoutesType[] = [
  {
    title: "Dashboard",
    value: "dashboard",
    icon: "mdi-home-city",
    href: "/dashboard",
  },
  {
    title: "Projects",
    value: "projects",
    icon: "mdi-view-dashboard-edit-outline",
    href: "/projects",
  },
  {
    title: "Users",
    value: "users",
    icon: "mdi-account-group-outline",
    href: "/users",
    elevated: true,
  },
];
