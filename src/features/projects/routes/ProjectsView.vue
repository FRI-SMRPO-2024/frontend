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
      <div class="grow w-full grid grid-cols-4 gap-5">
        <ProjectCard v-for="(project, idx) in Projects" :key="idx" />
      </div>
    </Section>
  </div>
</template>

<script setup lang="ts">
  import { Section, Dialog } from '@/components/Common';
  import { Projects } from '../mocks';
  import { CreateForm, ProjectCard } from '../components';
</script>