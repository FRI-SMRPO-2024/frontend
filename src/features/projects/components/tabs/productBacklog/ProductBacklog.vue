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
      <div
        v-if="
          useUserStore().getRole().includes('SCRUM_MASTER') ||
          useUserStore().getRole().includes('OWNER')
        "
        class="w-33 flex justify-end"
      >
        <Section class="text-end" title="Add a new story" icon="mdi-plus-box">
          <BtnDialog
            style="margin-top: -15px"
            title="Create new story"
            btnText="Create"
            btnIcon="mdi-plus"
            :dialogWidth="600"
            :displayActionBtn="false"
          >
            <CreateForm
              :project="props.project"
              @get-stories="triggerGetStories"
            ></CreateForm>
          </BtnDialog>
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
      <div v-if="!isLoading" class="grow w-full grid grid-cols-1 gap-1 mt-3">
        <v-divider
          style="border-color: blue; border-radius: 15px"
          :thickness="5"
        ></v-divider>
        <b>Sprint stories</b>
        <div>
          <StoryCard
            v-for="story in sprintStories"
            :key="story.id"
            :idx="story.id"
            :data="story"
            :projectId="project.id"
            :clickedTicket="clickedTicket"
            :currentSprint="currentSprint"
            @click="clickedTicket = story.id"
            @get-stories="triggerGetStories"
            @rejected-story="triggerGetStories"
            @accepted-story="triggerGetStories"
          />
        </div>
      </div>
      <div v-if="!isLoading" class="grow w-full grid grid-cols-1 gap-1 mt-3">
        <v-divider
          :thickness="5"
          style="border-color: green; border-radius: 15px"
        ></v-divider>
        <b>Completed stories</b>
        <div>
          <StoryCard
            v-for="story in completedStories"
            :key="story.id"
            :idx="story.id"
            :data="story"
            :projectId="project.id"
            :clickedTicket="clickedTicket"
            :currentSprint="currentSprint"
            @click="clickedTicket = story.id"
            @get-stories="triggerGetStories"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Project } from "@/features/projects";
import { useAxios } from "@/composables/useAxios";
import { CreateForm, Story, StoryCard } from "@/features/stories/";
import { Alert } from "@/components/Alert";
import { BtnDialog, Loader } from "@/components/Common";
import { useUserStore } from "@/stores/user.store";
import { Sprint } from "@/features/sprints";

const clickedTicket = ref<number>(-1);
const backlogStories = ref<Story[]>([]);
const sprintStories = ref<Story[]>([]);
const completedStories = ref<Story[]>([]);
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
    backlogStories.value = returned.filter(
      (story: Story) =>
        story.status === "PRODUCT" && story.priority !== "WONT_HAVE_THIS_TIME",
    );
    sprintStories.value = returned.filter(
      (story: Story) => story.status === "SPRINT",
    );
    completedStories.value = returned.filter(
      (story: Story) => story.status === "DONE",
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
