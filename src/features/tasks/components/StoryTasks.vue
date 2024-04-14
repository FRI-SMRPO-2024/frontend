<script setup lang="ts">
import { CreateTaskForm, TaskCard } from "@/features/tasks";
import { onMounted, ref } from "vue";
import { StoryTask } from "@/features/tasks/types";
import { useAxios } from "@/composables/useAxios";
import { Loader } from "@/components/Common";
import { Alert } from "@/components/Alert";
import { useUserStore } from "@/stores/user.store";

type StoryTasksProps = {
  storyId: number;
  storyStatus: string;
  projectId: number;
};

const props = defineProps<StoryTasksProps>();

const tasks = ref<StoryTask[]>([]);

const { execute, isLoading, isError, error } = useAxios<StoryTask[]>({
  method: "get",
  url: `task/get-by-story/${props.storyId}`,
});

const fetchTasks = () => {
  execute().then((res: StoryTask[]) => {
    tasks.value = res;
  });
};

const insertNewTask = () => {
  fetchTasks();
};

const deleteTask = (id: number) => {
  tasks.value = tasks.value.filter((task: StoryTask) => task.task.id !== id);
};

onMounted(() => {
  fetchTasks();
});
</script>

<template>
  <div class="flex flex-col justify-start space-y-6">
    <div class="flex-col justify-start space-y-2">
      <div class="font-medium text-sm text-gray-700">All tasks</div>
      <Alert v-if="isError" :message="error.message.error" type="error" />
      <div v-if="isLoading" class="flex justify-center">
        <Loader />
      </div>
      <div
        class="text-xs text-gray-600"
        v-if="tasks.length === 0 && !isLoading"
      >
        No tasks have been created for this story
      </div>
      <div v-else class="flex flex-col space-y-2">
        <TaskCard
          v-for="task in tasks"
          :key="task.task.id"
          :task="task"
          :projectId="projectId"
          @taskUpdated="insertNewTask"
          @taskDeleted="deleteTask"
        />
      </div>
    </div>
    <div
      v-if="
        storyStatus === 'SPRINT' && !useUserStore().getRole().includes('OWNER')
      "
    >
      <div class="flex-col justify-start space-y-2">
        <div class="font-medium text-sm text-gray-700">Create a new task</div>
        <CreateTaskForm
          :storyId="storyId"
          :projectId="projectId"
          @taskAdded="insertNewTask"
        />
      </div>
    </div>
  </div>
</template>
