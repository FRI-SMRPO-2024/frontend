import HelloWorld from "@/components/HelloWorld.vue";

export const protectedRoutes = [
    {
        path: "/",
        name: "dashboard",
        component: HelloWorld,
    },
];