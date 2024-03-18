<template>
  <div class="w-75 flex-column" style="margin-left: auto; margin-right: auto">
    <SprintCard
      :data="currentSprint"
      :idx="sprints.findIndex((obj) => obj.id === currentSprint.id)"
      :numSprints="sprints.length"
      class="mb-2"
    ></SprintCard>
    <div class="flex mx-4">
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
      <b v-if="stories.length === 0"> No stories added to this sprint! </b>
      <StoryCard
        v-for="(story, idx) in stories"
        :key="idx"
        :idx="idx"
        :data="story"
        :projectId="project.id"
        :clickedTicket="clickedTicket"
        :check="'SPRINT'"
        @click="clickedTicket = idx"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { StoryCard } from "@/features/stories";
import { onMounted, ref } from "vue";
import { Project } from "@/features/projects";
import { useAxios } from "@/composables/useAxios";
import SprintCard from "@/features/projects/components/tabs/sprints/SprintCard.vue";

const clickedTicket = ref<number>();
const currentSprint = ref<object>({});
let stories = ref([]);
let sprints = ref([]);

type SprintProps = {
  project: Project;
};

const props = defineProps<SprintProps>();
console.log(props.project.id);

const triggerGetStories = async () => {
  console.log(currentSprint.value.id);
  const { execute: getStories } = useAxios({
    method: "get",
    url: `story/get-by-sprint/${currentSprint.value.id}`,
  });

  await getStories().then((returned: []) => {
    stories.value = returned;
    console.log(stories);
  });
};

const triggerGetCurrentSprint = async () => {
  const { execute: getCurrentSprint } = useAxios({
    method: "get",
    url: `sprint/current/${props.project.id}`,
  });

  await getCurrentSprint().then((returned: object) => {
    currentSprint.value = returned;
  });
};

const triggerGetAllSprints = async () => {
  const { execute: getSprints } = useAxios({
    method: "get",
    url: `sprint/get-by-project-id/${props.project.id}`,
  });

  getSprints().then((returned: []) => {
    sprints.value = returned;
  });
};

onMounted(async () => {
  await triggerGetCurrentSprint();
  await triggerGetStories();
  await triggerGetAllSprints();
});
</script>
