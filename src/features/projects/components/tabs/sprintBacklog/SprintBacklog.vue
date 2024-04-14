<template>
  <div class="w-75 mx-auto flex-column flex items-center">
    <div v-if="sprintLoading" class="w-full flex justify-center mt-2">
      <Loader></Loader>
    </div>
    <Alert
      v-if="isSprintError"
      :message="sprintErorr.message.error"
      type="error"
    />
    <SprintCard
      v-if="!sprintLoading && currentSprint"
      :data="currentSprint"
      :idx="sprints.findIndex((obj) => obj.id === currentSprint?.id)"
      :numSprints="sprints.length"
      class="mb-2"
    ></SprintCard>
    <div v-if="tasksLoading" class="w-full flex justify-center mt-5">
      <Loader></Loader>
    </div>
    <Alert
      v-if="isTasksError"
      :message="tasksErorr.message.error"
      type="error"
    />
    <div
      v-if="!tasksLoading && !sprintLoading"
      class="grow w-full flex flex-column space-y-3 mt-5"
    >
      <Section
        title="Unassigned tasks"
        icon="mdi-view-dashboard-variant"
        description="Here are all the tasks that are unassigned in the current sprint"
      >
        <div class="flex flex-column space-y-1">
          <TaskCard
            v-for="task in sprintTasks.unassigned"
            :key="task.id"
            :task="{ task, assignee: null }"
            :project-id="project.id"
          />
        </div>
      </Section>
      <Section
        title="Assigned tasks"
        icon="mdi-view-dashboard-variant"
        description="Here are all the tasks that are assigned but not yet active"
      >
        <div class="flex flex-column space-y-1">
          <!--<TaskCard
            v-for="task in sprintTasks.assigned"
            :key="task.id"
            :task="{ task, assignee: null }"
            :project-id="project.id"
          />-->
        </div>
      </Section>
      <Section
        title="Active tasks"
        icon="mdi-view-dashboard-variant"
        description="Here are all the tasks that are active"
      >
        <div class="flex flex-column space-y-1">
          <TaskCard
            v-for="task in sprintTasks.active"
            :key="task.id"
            :task="{ task, assignee: null }"
            :project-id="project.id"
          />
        </div>
      </Section>
      <Section
        title="Compelted tasks"
        icon="mdi-view-dashboard-variant"
        description="Here are all the tasks that are completed"
      >
        <div class="flex flex-column space-y-1">
          <TaskCard
            v-for="task in sprintTasks.completed"
            :key="task.id"
            :task="{ task, assignee: null }"
            :project-id="project.id"
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
import { Task } from "@/features/tasks/types";
import { TaskCard } from "@/features/tasks";

const currentSprint = ref<Sprint | null>(null);
let sprints = ref([]);

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
  error: sprintErorr,
} = useAxios<Sprint>({
  method: "get",
  url: `sprint/current/${props.project.id}`,
});

const {
  execute: fetchSprintTasks,
  isLoading: tasksLoading,
  isError: isTasksError,
  error: tasksErorr,
} = useAxios<Task[]>({
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
  fetchSprintTasks({}, `task/get-by-sprint/${sprintId}`).then(
    (tasks: Task[]) => {
      tasks.forEach((task: Task) => {
        switch (task.status) {
          case "PENDING":
            sprintTasks.value.assigned.push(task);
            break;
          case "COMPLETED":
            sprintTasks.value.completed.push(task);
            break;
          case "ACTIVE":
            sprintTasks.value.active.push(task);
            break;
          default:
            sprintTasks.value.unassigned.push(task);
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
