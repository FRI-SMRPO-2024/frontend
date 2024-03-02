import { LoginView } from "@/features/auth/routes";

export const publicRoutes = [
  {
    path: "/auth/login",
    name: "login",
    component: LoginView,
  },
];
