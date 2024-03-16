<template>
  <div class="w-full flex flex-col space-y-8">
    <Section
      title="Add a new project"
      icon="mdi-book-plus"
      description="Create a new project for your team"
    >
      <Dialog
        title="Create a project"
        btnText="Create"
        btnIcon="mdi-plus"
        :dialogWidth="700"
        :displayActionBtn="false"
      >
        <CreateForm />
      </Dialog>
    </Section>
    <Section
      title="All projects"
      icon="mdi-view-dashboard-variant"
      description="Here are all the projects that are assigned to you. Click the one you want to expand"
    >
      <Alert v-if="isError" :message="error.message" type="error" />
      <div v-if="isLoading" class="flex justify-center">
        <Loader />
      </div>
      <div v-else class="grow w-full grid grid-cols-2 gap-5">
        <ProjectCard
          v-for="(project, idx) in projects"
          :key="idx"
          :data="project"
        />
      </div>
    </Section>
  </div>
</template>

<script setup lang="ts">
import { Section, Dialog, Loader } from "@/components/Common";
import { CreateForm, ProjectCard } from "../components";
import { useAxios } from "@/composables/useAxios";
import { Project } from "@/features/projects";
import { ref } from "vue";
import { Alert } from "@/components/Alert";
import emitter from "@/plugins";

const { execute, isLoading, isError, error } = useAxios<Project[]>({
  method: "get",
  url: "project/get-all",
});

const projects = ref<Project[]>([]);

const fetchProjects = () => {
  execute().then((res: Project[]) => {
    projects.value = res;
  });
};

fetchProjects();

emitter.on("dialogClose", () => {
  fetchProjects();
});
</script>
