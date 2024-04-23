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
        <component
          :is="projectTab.component"
          v-bind="projectTab.props"
          :key="tab"
        />
      </v-window-item>
    </v-window>
  </div>
</template>
<script setup lang="ts">
import {
  Documentation,
  Overview,
  ProductBacklog,
  FutureReleases,
  Project,
  ProjectTab,
  SprintBacklog,
  Sprints,
  Wall,
} from "@/features/projects";
import { ref } from "vue";

type ProjectTabsProps = {
  project: Project;
};

const props = defineProps<ProjectTabsProps>();

const PROJECT_TABS: ProjectTab[] = [
  {
    title: "Overview",
    component: Overview,
    props: {
      project: props.project,
    },
  },
  {
    title: "Product Backlog",
    component: ProductBacklog,
    props: {
      project: props.project,
    },
  },
  {
    title: "Future Releases",
    component: FutureReleases,
    props: {
      project: props.project,
    },
  },
  {
    title: "Sprint Backlog",
    component: SprintBacklog,
    props: {
      project: props.project,
    },
  },
  {
    title: "Sprints",
    component: Sprints,
    props: {
      project: props.project,
    },
  },
  {
    title: "Wall",
    component: Wall,
    props: {
      project: props.project,
    },
  },
  {
    title: "Documentation",
    component: Documentation,
    props: {
      project: props.project,
    },
  },
];

const tab = ref();
</script>
