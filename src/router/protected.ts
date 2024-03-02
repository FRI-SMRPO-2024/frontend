import { DashboardView } from "@/features/misc";
import { ProjectsView } from "@/features/projects";
import { UsersView } from "@/features/users";

export const protectedRoutes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
  },
  {
    path: "/projects",
    name: "projects",
    component: ProjectsView,
  },
  {
    path: "/users",
    name: "users",
    component: UsersView,
  },
];
