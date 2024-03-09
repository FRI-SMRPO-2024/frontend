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
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { sidebarRoutes } from "./sidebar.routes";

const route = useRoute();

function isActive(href: string): boolean {
  return route.fullPath.includes(href.replace("/", ""));
}
</script>
