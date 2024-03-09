import { DashboardView } from "@/features/misc";
import { ProjectView, ProjectsIndex } from "@/features/projects";
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
    component: ProjectsIndex,
  },
  {
    path: "/projects/:id",
    name: "projects.view",
    component: ProjectView,
  },
  {
    path: "/users",
    name: "users",
    component: UsersView,
  },
];
