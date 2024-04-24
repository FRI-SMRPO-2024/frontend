<template>
  <div class="w-75 mx-auto flex-column flex items-center">
    <div v-if="sprintLoading" class="w-full flex justify-center mt-2">
      <Loader></Loader>
    </div>
    <Alert
      v-if="isSprintError"
      :message="sprintError.message.error"
      type="error"
    />
    <SprintCard
      v-if="!sprintLoading && currentSprint"
      :data="currentSprint"
      :idx="sprints.findIndex((obj) => obj.id === currentSprint?.id)"
      :numSprints="sprints.length"
      class="mb-2"
    ></SprintCard>
    <Alert
      v-if="isTasksError"
      :message="tasksError.message.error"
      type="error"
    />
    <div
      v-if="!sprintLoading"
      class="grow w-full flex flex-column space-y-3 mt-5"
    >
      <Section
        title="Unassigned tasks"
        icon="mdi-view-dashboard-variant"
        description="Here are all the tasks that are unassigned in the current sprint"
      >
        <div v-if="tasksLoading" class="w-full flex justify-center mt-5">
          <Loader></Loader>
        </div>
        <div v-else class="flex flex-column space-y-1">
          <TaskCard
            v-for="task in sprintTasks.unassigned"
            :key="task.task.id"
            :task="task"
            :project-id="project.id"
            @taskUpdated="getSprintTasks(currentSprint?.id as number)"
            @taskDeleted="getSprintTasks(currentSprint?.id as number)"
          />
        </div>
      </Section>
      <Section
        title="Assigned tasks"
        icon="mdi-view-dashboard-variant"
        description="Here are all the tasks that are assigned but not yet active"
      >
        <div v-if="tasksLoading" class="w-full flex justify-center mt-5">
          <Loader></Loader>
        </div>
        <div v-else class="flex flex-column space-y-1">
          <TaskCard
            v-for="task in sprintTasks.assigned"
            :key="task.task.id"
            :task="task"
            :project-id="project.id"
            @taskUpdated="getSprintTasks(currentSprint?.id as number)"
            @taskDeleted="getSprintTasks(currentSprint?.id as number)"
          />
        </div>
      </Section>
      <Section
        title="Active tasks"
        icon="mdi-view-dashboard-variant"
        description="Here are all the tasks that are active"
      >
        <div v-if="tasksLoading" class="w-full flex justify-center mt-5">
          <Loader></Loader>
        </div>
        <div v-else class="flex flex-column space-y-1">
          <TaskCard
            v-for="task in sprintTasks.active"
            :key="task.task.id"
            :task="task"
            :project-id="project.id"
            @taskUpdated="getSprintTasks(currentSprint?.id as number)"
            @taskDeleted="getSprintTasks(currentSprint?.id as number)"
          />
        </div>
      </Section>
      <Section
        title="Completed tasks"
        icon="mdi-view-dashboard-variant"
        description="Here are all the tasks that are completed"
      >
        <div v-if="tasksLoading" class="w-full flex justify-center mt-5">
          <Loader></Loader>
        </div>
        <div v-else class="flex flex-column space-y-1">
          <TaskCard
            v-for="task in sprintTasks.completed"
            :key="task.task.id"
            :task="task"
            :project-id="project.id"
            @taskUpdated="getSprintTasks(currentSprint?.id as number)"
            @taskDeleted="getSprintTasks(currentSprint?.id as number)"
          />
        </div>
      </Section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Project } from "@/features/projects";
import { useAxios } from "@/composables/useAxios";
import { Sprint, SprintCard, SprintTasks } from "@/features/sprints";
import Loader from "@/components/Common/Loader.vue";
import { Alert } from "@/components/Alert";
import { StoryTask } from "@/features/tasks/types";
import { TaskCard } from "@/features/tasks";

const currentSprint = ref<Sprint | null>(null);
let sprints = ref<Sprint[]>([]);

type SprintProps = {
  project: Project;
};

const props = defineProps<SprintProps>();
const sprintTasks = ref<SprintTasks>({
  active: [],
  assigned: [],
  completed: [],
  unassigned: [],
});

const {
  execute: getCurrentSprint,
  isLoading: sprintLoading,
  isError: isSprintError,
  error: sprintError,
} = useAxios<Sprint>({
  method: "get",
  url: `sprint/current/${props.project.id}`,
});

const {
  execute: fetchSprintTasks,
  isLoading: tasksLoading,
  isError: isTasksError,
  error: tasksError,
} = useAxios<StoryTask[]>({
  method: "get",
  url: ``,
});

const getSprint = () => {
  getCurrentSprint().then((returnedSprint: Sprint) => {
    currentSprint.value = returnedSprint;

    if (returnedSprint.id) {
      getSprintTasks(returnedSprint.id);
    }
  });
};

const getSprintTasks = (sprintId: number) => {
  sprintTasks.value = {
    active: [],
    assigned: [],
    completed: [],
    unassigned: [],
  };
  fetchSprintTasks({}, `task/get-by-sprint/${sprintId}`).then(
    (tasks: StoryTask[]) => {
      tasks.forEach((storyTask: StoryTask) => {
        switch (storyTask.task.status) {
          case "ACCEPTED":
            sprintTasks.value.assigned.push(storyTask);
            break;
          case "COMPLETED":
            sprintTasks.value.completed.push(storyTask);
            break;
          case "ACTIVE":
            sprintTasks.value.active.push(storyTask);
            break;
          default:
            sprintTasks.value.unassigned.push(storyTask);
            break;
        }
      });
    },
  );
};

onMounted(() => {
  getSprint();
});
</script>
