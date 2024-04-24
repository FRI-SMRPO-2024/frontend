<template>
  <div class="w-75 flex-column" style="margin-left: auto; margin-right: auto">
    <div class="flex mx-4">
      <div class="w-66 flex space-y-8">
        <Section
          title="All product stories that are planed for future releases."
          icon="mdi-view-dashboard-variant"
          description="Click the one you want to expand"
        >
        </Section>
      </div>
    </div>
    <div class="grow w-full grid grid-cols-1 gap-3 mt-3">
      <Alert v-if="isError" :message="error.message.message" type="error" />
      <div v-if="isLoading" class="flex justify-center">
        <Loader />
      </div>
      <div>
        <StoryCard
          v-for="story in backlogStories"
          :key="story.id"
          :idx="story.id"
          :data="story"
          :projectId="project.id"
          :clickedTicket="clickedTicket"
          :currentSprint="currentSprint"
          @click="clickedTicket = story.id"
          @get-stories="triggerGetStories"
          @deleteStory="deleteStory"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Project } from "@/features/projects";
import { useAxios } from "@/composables/useAxios";
import { Story, StoryCard } from "@/features/stories/";
import { Alert } from "@/components/Alert";
import { Loader } from "@/components/Common";
import { Sprint } from "@/features/sprints";

const clickedTicket = ref<number>(-1);
const backlogStories = ref<Story[]>([]);
const currentSprint = ref<object>({});

type SprintProps = {
  project: Project;
};

const props = defineProps<SprintProps>();

const {
  execute: getStories,
  isLoading,
  isError,
  error,
} = useAxios<Story[]>({
  method: "get",
  url: `story/get-by-project/${props.project.id}`,
});

const { execute: getCurrentSprint } = useAxios<Sprint>({
  method: "get",
  url: `sprint/current/${props.project.id}`,
});

getCurrentSprint().then((returnedSprint: Sprint) => {
  currentSprint.value = returnedSprint;
});

const triggerGetStories = () => {
  getStories().then((returned: Story[]) => {
    console.log(returned);
    backlogStories.value = returned.filter(
      (story: Story) =>
        story.status === "PRODUCT" && story.priority === "WONT_HAVE_THIS_TIME",
    );
  });
};

const deleteStory = (id: number) => {
  backlogStories.value = backlogStories.value.filter(
    (story: Story) => story.id !== id,
  );
};

onMounted(() => {
  triggerGetStories();
});
</script>
