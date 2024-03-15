<template>
  <v-navigation-drawer theme="dark" permanent :width="320">
    <v-list>
      <v-list-item
        prepend-avatar="@/assets/logo.png"
        subtitle="SMRPO Group 2"
        title="Jira Clone"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>
    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        v-for="(route, idx) in sidebarRoutes"
        v-bind:key="idx"
        :prepend-icon="route.icon"
        :title="route.title"
        :value="route.value"
        :to="route.href"
        :active="isActive(route.href)"
      ></v-list-item>
    </v-list>
    <template #append v-if="userStore.isAuthenticated()">
      <div class="pb-4 flex justify-center">
        <v-btn
          variant="flat"
          color="#e8e8e8"
          class="text-none w-2/5"
          @click="logoutUser()"
        >
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { sidebarRoutes } from "./sidebar.routes";
import { useUserStore } from "@/stores/user.store";
import { useAxios } from "@/composables/useAxios";
import { LoginResponse } from "@/features/auth";
import { handleLogout } from "@/features/auth/api";
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

function isActive(href: string): boolean {
  return route.fullPath.includes(href.replace("/", ""));
}

const { execute } = useAxios<LoginResponse>({
  method: "post",
  url: "auth/logout",
});

const logoutUser = () => {
  execute().then(() => {
    handleLogout();
    router.push({ name: "login" });
  });
};
</script>
