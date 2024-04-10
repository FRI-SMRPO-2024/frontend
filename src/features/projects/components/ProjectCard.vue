<template>
  <div
    class="rounded-md border-gray-100 border p-2 rounded-3xl p-4 w-full transition duration-300 ease-in-out hover:shadow-md"
  >
    <div class="flex justify-start space-x-4">
      <img
        src="../../../assets/project_placeholder.png"
        class="rounded-lg w-52"
      />
      <div class="flex flex-column w-full">
        <div class="grow">
          <div
            class="w-full flex-none text-lg text-gray-800 font-bold leading-none"
          >
            {{ data.name }}
          </div>
          <div class="flex-auto text-gray-500 my-1 line-clamp-5">
            {{ data.description }}
          </div>
        </div>
        <div class="shrink flex justify-end w-full">
          <v-btn
            class="text-none"
            variant="flat"
            color="#5865f2"
            rounded="lg"
            append-icon="mdi-chevron-right"
            @click="handleProjectOpen(data.id)"
          >
            More
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Project } from "@/features/projects";
import { useRouter } from "vue-router";
type ProjectCardProps = {
  data: Project;
};

defineProps<ProjectCardProps>();
const router = useRouter();

const handleProjectOpen = (projectId: number) => {
  router.push({ name: "projects.view", params: { id: projectId } });
};
</script>
