<template>
  <div class="w-full flex flex-col space-y-8">
    <Section
      v-if="isAdmin"
      title="Add a new project"
      icon="mdi-book-plus"
      description="Create a new project for your team"
    >
      <BtnDialog
        title="Create a project"
        btnText="Create"
        btnIcon="mdi-plus"
        :dialogWidth="700"
        :displayActionBtn="false"
      >
        <CreateForm />
      </BtnDialog>
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
import { Section, Loader, BtnDialog } from "@/components/Common";
import { CreateForm, ProjectCard } from "../components";
import { useAxios } from "@/composables/useAxios";
import { Project, UserProjects } from "@/features/projects";
import { onMounted, ref, toRef } from "vue";
import { Alert } from "@/components/Alert";
import emitter from "@/plugins";
import { useUserStore } from "@/stores/user.store";

const user = useUserStore().getData();
const url = user?.is_admin
  ? "project/get-all"
  : `user-project/get-user-projects/${user?.id}`;

const { execute, isLoading, isError, error } = useAxios<
  Project[] | UserProjects[]
>({
  method: "get",
  url,
});

const projects = ref<Project[]>([]);
const isAdmin = toRef<boolean>(!!user?.is_admin);

const fetchProjects = () => {
  execute().then((res: Project[] | UserProjects[]) => {
    if (!isAdmin.value) {
      projects.value = res.map(
        (userProjects: UserProjects) => userProjects.project,
      );
    } else {
      projects.value = res as Project[];
    }
  });
};

onMounted(() => {
  fetchProjects();
});

emitter.on("dialogClose", () => {
  fetchProjects();
});
</script>
