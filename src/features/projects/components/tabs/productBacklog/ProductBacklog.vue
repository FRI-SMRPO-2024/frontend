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
        v-if="useUserStore().getRole() !== 'DEVELOPER'"
        class="w-33 flex justify-end"
      >
        <Section class="text-end" title="Add a new story" icon="mdi-plus-box">
          <Dialog
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
          </Dialog>
        </Section>
      </div>
    </div>
    <div class="grow w-full grid grid-cols-1 gap-3 mt-3" :key="stories">
      <Alert v-if="isError" :message="error.message" type="error" />
      <div v-if="isLoading" class="flex justify-center">
        <Loader />
      </div>
      <div v-if="!isLoading">
        <StoryCard
          v-for="(story, idx) in stories"
          :key="idx"
          :idx="idx"
          :data="story"
          :projectId="project.id"
          :clickedTicket="clickedTicket"
          :check="'PRODUCT'"
          @click="clickedTicket = idx"
          @get-stories="triggerGetStories"
        />
      </div>
      <div
        v-if="!isLoading"
        class="grow w-full grid grid-cols-1 gap-3 mt-3"
        :key="stories"
      >
        <v-divider
          style="border-color: blue; border-radius: 15px"
          :thickness="5"
        ></v-divider>
        <b>Sprint stories</b>
        <StoryCard
          v-for="(story, idx) in stories"
          :key="idx"
          :idx="idx"
          :data="story"
          :projectId="project.id"
          :clickedTicket="clickedTicket"
          :check="'SPRINT'"
          @click="clickedTicket = idx"
          @get-stories="triggerGetStories"
        />
      </div>
      <div
        v-if="!isLoading"
        class="grow w-full grid grid-cols-1 gap-3 mt-3"
        :key="stories"
      >
        <v-divider
          :thickness="5"
          style="border-color: green; border-radius: 15px"
        ></v-divider>
        <b>Completed stories</b>
        <StoryCard
          v-for="(story, idx) in stories"
          :key="idx"
          :idx="idx"
          :data="story"
          :projectId="project.id"
          :clickedTicket="clickedTicket"
          :check="'DONE'"
          @click="clickedTicket = idx"
          @get-stories="triggerGetStories"
        />
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
import { Loader } from "@/components/Common";
import { useUserStore } from "@/stores/user.store";

const clickedTicket = ref<number>(-1);
let stories = ref<Story[]>([]);

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

const triggerGetStories = () => {
  getStories().then((returned: Story[]) => {
    stories.value = returned;
  });
};

onMounted(() => {
  triggerGetStories();
});
</script>
