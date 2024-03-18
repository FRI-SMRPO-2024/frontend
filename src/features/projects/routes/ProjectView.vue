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
import { Project, UserRole } from "@/features/projects";
import { onMounted, ref } from "vue";
import { useAxios } from "@/composables/useAxios";
import { Alert } from "@/components/Alert";
import { Loader } from "@/components/Common";
import { useUserStore } from "@/stores/user.store";

const router = useRouter();
const route = useRoute();
const fetchedProject = ref<Project>();

const {
  execute: fetchProject,
  isLoading,
  isError,
  error,
} = useAxios<Project>({
  method: "get",
  url: `project/get/${route.params.id}`,
});

const { execute: fetchRole } = useAxios<UserRole>({
  method: "post",
  url: `user-project/get-user-project`,
});

const getUserRole = (projectId: number) => {
  fetchRole({
    user_id: useUserStore().getData()?.id ?? "",
    project_id: projectId,
  }).then((res: UserRole) => {
    useUserStore().setRole(res.role);
  });
};

onMounted(() => {
  fetchProject().then((res: Project) => {
    fetchedProject.value = res;
    getUserRole(res.id);
  });
});

const handleBack = () => router.back();
</script>
