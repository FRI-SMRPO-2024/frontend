<template>
  <Alert v-if="isError" :message="error.message" type="error" />
  <div v-if="isLoading" class="flex justify-center">
    <Loader />
  </div>
  <div v-else class="flex items-center justify-start space-x-2 mb-5">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="handleBack"
      >Back</v-btn
    >
    <h2 class="text-lg text-gray-800 font-bold leading-none">
      {{ fetchedProject?.name }}
    </h2>
  </div>
  <div class="flex justify-center w-full">
    <ProjectTabs v-if="fetchedProject" :project="fetchedProject" />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import ProjectTabs from "@/features/projects/components/ProjectTabs.vue";
import { Project } from "@/features/projects";
import { ref } from "vue";
import { useAxios } from "@/composables/useAxios";
import { Alert } from "@/components/Alert";
import { Loader } from "@/components/Common";

const router = useRouter();
const route = useRoute();
const fetchedProject = ref<Project>();

const { execute, isLoading, isError, error } = useAxios<Project>({
  method: "get",
  url: `project/get/${route.params.id}`,
});

execute().then((res: Project) => {
  fetchedProject.value = res;
});

const handleBack = () => router.back();
</script>
