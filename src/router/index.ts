import { createRouter, createWebHistory } from "vue-router";

import { protectedRoutes } from "./protected";
import { publicRoutes } from "./public";
import { LAYOUTS } from "@/config";

const routes = [
  ...protectedRoutes.map((route: object) => ({
    ...route,
    meta: { layout: LAYOUTS.AUTHENTICATED },
  })),
  ...publicRoutes.map((route: object) => ({
    ...route,
    meta: { layout: LAYOUTS.DEFAULT },
  })),
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
