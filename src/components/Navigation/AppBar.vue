<template>
  <v-app-bar class="px-3">
    <template v-slot:prepend>
      <Heading :title="route.name as string" :icon="getCurrentRouteIcon" />
    </template>
    <template v-slot:append>
      <div class="flex items-center space-x-4">
        <div class="text-sm">John Doe</div>
        <v-btn icon="mdi-account" size="small" class="bg-gray-900/10"></v-btn>
      </div>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Heading } from "../Heading";
import { useRoute } from "vue-router";
import { sidebarRoutes } from "./sidebar.routes";

const route = useRoute();

const getCurrentRouteIcon = computed(() => {
  const currentRoute = sidebarRoutes.find(
    (item) => item.value === (route.name as string),
  );

  return currentRoute ? currentRoute.icon : "";
});
</script>
