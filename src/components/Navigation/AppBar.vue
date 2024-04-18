<template>
  <v-app-bar class="px-3">
    <template v-slot:prepend>
      <Heading
        :title="route.name as string"
        :icon="getCurrentRouteIcon ? getCurrentRouteIcon : 'mdi-account'"
      />
    </template>
    <template v-slot:append>
      <v-menu v-model="menu" :close-on-content-click="true" location="bottom">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="flex items-center space-x-4">
            <div class="text-sm">{{ userStore.getData()?.username }}</div>
            <v-btn
              icon="mdi-account"
              size="small"
              class="bg-gray-900/10"
            ></v-btn>
          </div>
        </template>
        <v-card min-width="300">
          <v-list>
            <v-list density="compact" nav>
              <v-list-item class="text-xs text-gray-700"
                >Last login:
                {{
                  formattedDateTime(userStore.getData()?.last_login ?? "")
                }}</v-list-item
              >

              <v-divider></v-divider>
              <v-divider></v-divider>
              <v-divider></v-divider>

              <v-list-item
                prepend-icon="mdi-account"
                @click="router.push({ name: `profile` })"
                title="Profile"
                value="profile"
              />
              <v-list-item
                prepend-icon="mdi-logout"
                title="Logout"
                value="logout"
                @click="logoutUser"
              />
            </v-list>
          </v-list>
        </v-card>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Heading } from "../Heading";
import { useRoute, useRouter } from "vue-router";
import { sidebarRoutes } from "./sidebar.routes";
import { useUserStore } from "@/stores/user.store";
import { formattedDateTime } from "@/utils/date";
import { useAxios } from "@/composables/useAxios";
import { LoginResponse } from "@/features/auth";
import { handleLogout } from "@/features/auth/api";

const route = useRoute();
const router = useRouter();

const userStore = useUserStore();
const menu = ref<boolean>(false);

const getCurrentRouteIcon = computed(() => {
  const currentRoute = sidebarRoutes.find((item) =>
    (route.name as string).includes(item.value),
  );

  return currentRoute ? currentRoute.icon : "";
});

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
