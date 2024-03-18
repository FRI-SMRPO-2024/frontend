<template>
  <div class="w-75 flex-column" style="margin-left: auto; margin-right: auto">
    <div v-if="isLoading">
      <Loader></Loader>
    </div>
    <div v-if="!isLoading && Object.keys(currentSprint).length === 0">
      <Alert message="No sprint is currently active!" type="info" />
    </div>
    <SprintCard
      v-if="!isLoading && Object.keys(currentSprint).length !== 0"
      :data="currentSprint"
      :idx="sprints.findIndex((obj) => obj.id === currentSprint.id)"
      :numSprints="sprints.length"
      class="mb-2"
    ></SprintCard>
    <div
      class="flex mx-4"
      v-if="!isLoading && Object.keys(currentSprint).length !== 0"
    >
      <div class="w-66 flex space-y-8">
        <Section
          title="All sprint backlog stories."
          icon="mdi-view-dashboard-variant"
          description="Here are all the stories that are assigned this sprint. Click the one you want to expand"
        >
        </Section>
      </div>
    </div>
    <div class="grow w-full grid grid-cols-1 gap-3 mt-3">
      <div>
        <b v-if="stories.length === 0"> No stories added to this sprint! </b>
        <StoryCard
          v-for="(story, idx) in stories"
          :key="idx"
          :idx="idx"
          :data="story"
          :projectId="project.id"
          :clickedTicket="clickedTicket"
          :currentSprint="currentSprint"
          :check="'SPRINT'"
          @click="clickedTicket = idx"
          class="ma-2"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { StoryCard } from "@/features/stories";
import { ref } from "vue";
import { Project } from "@/features/projects";
import { useAxios } from "@/composables/useAxios";
import SprintCard from "@/features/projects/components/tabs/sprints/SprintCard.vue";
import Loader from "@/components/Common/Loader.vue";

const clickedTicket = ref<number>();
const currentSprint = ref<object>({});
let stories = ref([]);
let sprints = ref([]);

type SprintProps = {
  project: Project;
};

const props = defineProps<SprintProps>();
console.log(props.project.id);

const { execute: getCurrentSprint, isLoading } = useAxios({
  method: "get",
  url: `sprint/current/${props.project.id}`,
});

getCurrentSprint().then((returnedSprint: object) => {
  currentSprint.value = returnedSprint;
  if (Object.keys(currentSprint.value).length !== 0) triggerGetStories();
});

function triggerGetStories() {
  console.log("SPRINT");
  const { execute: getStories } = useAxios({
    method: "get",
    url: `story/get-by-sprint/${currentSprint.value.id}`,
  });

  getStories().then((returnedStories: []) => {
    stories.value = returnedStories;
    triggerGetSprints();
  });
}

function triggerGetSprints() {
  const { execute: getSprints } = useAxios({
    method: "get",
    url: `sprint/get-by-project-id/${props.project.id}`,
  });

  getSprints().then((returnedSprints: []) => {
    sprints.value = returnedSprints;
  });
}
</script>
