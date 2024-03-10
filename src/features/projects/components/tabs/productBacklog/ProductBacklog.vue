<template>
  <div class="w-full flex align-center flex-col space-y-8">
    <Section
      title="Add a new story"
      description="Create a new story for this project."
      icon="mdi-plus-box"
    >
      <Dialog
        title="Create new story"
        btnText="Create"
        btnIcon="mdi-plus"
        :dialogWidth="600"
        :displayActionBtn="false"
      >
        <CreateForm></CreateForm>
      </Dialog>
    </Section>
    <Section
      title="All product backlog stories."
      icon="mdi-view-dashboard-variant"
      description="Here are all the stories that are assigned this project. Click the one you want to expand"
    >
      <div class="grow w-full grid grid-cols-1 gap-5">
        <StoryCard v-for="(story, idx) in Stories" :key="idx" :data="story" />
      </div>
    </Section>
  </div>
</template>
<script setup lang="ts">
import CreateForm from "@/features/projects/components/tabs/productBacklog/CreateForm";
import { Stories } from "../../../mocks/";
import StoryCard from "@/features/projects/components/tabs/productBacklog/StoryCard";

console.log(Stories);
</script>
