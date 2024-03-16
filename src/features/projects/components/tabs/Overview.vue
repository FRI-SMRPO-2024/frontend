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
      <Table
        :headers="['Email', 'Username', 'Full name', 'Role']"
        :rows="[]"
        :displayActions="false"
      />
    </Section>
  </div>
</template>
<script setup lang="ts">
import { Section, Table } from "@/components/Common";
import { Project } from "@/features/projects";

type OverviewProps = {
  project: Project;
};

const props = defineProps<OverviewProps>();
console.log(props);
</script>
