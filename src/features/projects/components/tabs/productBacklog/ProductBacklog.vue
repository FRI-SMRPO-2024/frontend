<template>
  <div class="w-75 flex-column" style="margin-left: auto; margin-right: auto">
    <div class="flex mx-4">
      <div class="w-66 flex space-y-8">
        <Section
          title="All product backlog stories."
          icon="mdi-view-dashboard-variant"
          description="Here are all the stories that are assigned this project. Click the one you want to expand"
        >
        </Section>
      </div>
      <div class="w-33 flex justify-end">
        <Section class="text-end" title="Add a new story" icon="mdi-plus-box">
          <Dialog
            style="margin-top: -15px"
            title="Create new story"
            btnText="Create"
            btnIcon="mdi-plus"
            :dialogWidth="600"
            :displayActionBtn="false"
          >
            <CreateForm></CreateForm>
          </Dialog>
        </Section>
      </div>
    </div>
    <div class="grow w-full grid grid-cols-1 gap-5 mt-3">
      <StoryCard
        class=""
        v-for="(story, idx) in Stories"
        :key="idx"
        :idx="idx"
        :data="story"
        :clickedTicket="clickedTicket"
        @click="clickedTicket = idx"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import CreateForm from "@/features/projects/components/tabs/productBacklog/CreateForm";
import { Stories } from "../../../mocks/";
import StoryCard from "@/features/projects/components/tabs/productBacklog/StoryCard";
import { ref } from "vue";

const clickedTicket = ref(null);

console.log(Stories);
</script>
