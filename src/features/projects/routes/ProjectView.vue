<template>
  <div class="flex items-center justify-start space-x-2 mb-5">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="handleBack"
      >Back</v-btn
    >
    <h2 class="text-lg text-gray-800 font-bold leading-none">
      {{ fetchedProject.title }}
    </h2>
  </div>
  <div class="flex justify-center w-full">
    <ProjectTabs />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import ProjectTabs from "@/features/projects/components/ProjectTabs.vue";
import { Project, Projects } from "@/features/projects";

const router = useRouter();

const fetchedProject: Project = Projects[0];

const handleBack = () => router.back();
</script>
