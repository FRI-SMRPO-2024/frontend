import LoginView from "@/features/auth/routes/LoginView";

export const publicRoutes = [
    {
        path: "/auth/login",
        name: "login",
        component: LoginView,
    },
];