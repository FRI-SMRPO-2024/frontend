<template>
  <div class="w-full">
    <v-tabs v-model="tab" align-tabs="center" color="#5865f2">
      <v-tab
        v-for="(projectTab, idx) in PROJECT_TABS"
        :key="idx"
        :value="idx"
        class="text-none"
        >{{ projectTab.title }}</v-tab
      >
    </v-tabs>
    <v-window v-model="tab" class="mt-10">
      <v-window-item v-for="(projectTab, idx) in PROJECT_TABS" :key="idx">
        <component :is="projectTab.component" v-bind="projectTab.props" />
      </v-window-item>
    </v-window>
  </div>
</template>
<script setup lang="ts">
import {
  Documentation,
  Overview,
  ProductBacklog,
  ProjectTab,
  SprintBacklog,
  Sprints,
  Wall,
} from "@/features/projects";
import { ref } from "vue";

const PROJECT_TABS: ProjectTab[] = [
  {
    title: "Overview",
    component: Overview,
  },
  {
    title: "Product Backlog",
    component: ProductBacklog,
  },
  {
    title: "Sprint Backlog",
    component: SprintBacklog,
  },
  {
    title: "Sprints",
    component: Sprints,
  },
  {
    title: "Wall",
    component: Wall,
  },
  {
    title: "Documentation",
    component: Documentation,
  },
];

const tab = ref();
</script>
