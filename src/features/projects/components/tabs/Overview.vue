<template>
  <div class="w-75 flex-column space-y-8 mx-auto">
    <Section
      title="Description"
      icon="mdi-information"
      :description="project.description"
      class="shrink"
    >
    </Section>
    <Section
      title="Assigned Users"
      description="Displayed table that shows all the users assigned to the project."
      icon="mdi-account-group-outline"
      class="grow"
    >
      <Alert v-if="isError" :message="error.message" type="error" />
      <div v-if="isLoading" class="flex justify-center">
        <Loader />
      </div>
      <Table
        v-else
        :headers="['Email', 'Username', 'Full name', 'Role']"
        :rows="tableRows"
        :displayActions="false"
      />
    </Section>
  </div>
</template>
<script setup lang="ts">
import { Loader, Section, Table } from "@/components/Common";
import { Project, ProjectUser } from "@/features/projects";
import { useAxios } from "@/composables/useAxios";
import { Alert } from "@/components/Alert";
import { onMounted, ref } from "vue";

type OverviewProps = {
  project: Project;
};

const props = defineProps<OverviewProps>();

const mapUsersToTable = (projectUsers: ProjectUser[]) => {
  return projectUsers.map((projectUser: ProjectUser) => ({
    email: projectUser.user.email,
    username: projectUser.user.username,
    fullname: `${projectUser.user.firstName} ${projectUser.user.lastName}`,
    role: projectUser.role.toLowerCase(),
  }));
};

const { execute, isLoading, isError, error } = useAxios<ProjectUser[]>({
  method: "get",
  url: `user-project/get-project-users/${props.project.id}`,
});

const tableRows = ref<object[]>([]);
onMounted(() => {
  execute().then((res: ProjectUser[]) => {
    tableRows.value = mapUsersToTable(res);
  });
});
</script>
