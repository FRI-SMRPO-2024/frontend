<script setup lang="ts">
import router from "@/router";
import { LAYOUTS } from "@/config";
import { NavigationGuardNext, useRoute } from "vue-router";
import { Authenticated, Default } from "@/components/Layout";
import { protectedRoutes } from "@/router/protected";
import { useUserStore } from "@/stores/user.store";
import { useToast } from "vue-toast-notification";
import { useAuth } from "@/composables/useAuth";
import { AuthUser, LoginResponse } from "@/features/auth";
import { handleSuccessAuth } from "@/features/auth/api";

const route = useRoute();
const userStore = useUserStore();

const isProtected = (name: string): boolean => {
  return !!protectedRoutes.find((c) => c.name === name);
};

const unauthorizedUser = (next: NavigationGuardNext) => {
  useToast().info("You must be authorized access the platform!", {
    position: "top",
  });
  next({ name: "login" });
};

router.beforeEach((to, from, next) => {
  if (isProtected(to.name as string) && !userStore.isAuthenticated()) {
    const { hasTokens, getMe } = useAuth();
    if (!hasTokens()) {
      unauthorizedUser(next);
      return;
    }

    getMe()
      .then((data: AuthUser | LoginResponse) => {
        if (!Object.prototype.hasOwnProperty.call(data, "access_token")) {
          useUserStore().add(data as AuthUser);
        } else {
          handleSuccessAuth(data as LoginResponse);
        }

        next();
      })
      .catch(() => unauthorizedUser(next));
  } else {
    next();
  }
});
</script>
<template>
  <Authenticated v-if="route.meta.layout == LAYOUTS.AUTHENTICATED">
    <RouterView />
  </Authenticated>
  <Default v-else>
    <RouterView />
  </Default>
</template>
