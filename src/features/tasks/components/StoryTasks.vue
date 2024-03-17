<script setup lang="ts">
import { CreateTaskForm, TaskCard } from "@/features/tasks";
import { onMounted, ref } from "vue";
import { Task } from "@/features/tasks/types";
import { useAxios } from "@/composables/useAxios";
import { Loader } from "@/components/Common";
import { Alert } from "@/components/Alert";

type StoryTasksProps = {
  storyId: number;
  projectId: number;
};

const props = defineProps<StoryTasksProps>();

const tasks = ref<Task[]>([]);

const { execute, isLoading, isError, error } = useAxios<Task[]>({
  method: "get",
  url: `task/get-by-story/${props.storyId}`,
});

const insertNewTask = (task: Task) => {
  tasks.value = [...tasks.value, task];
};

onMounted(() => {
  execute().then((res: Task[]) => {
    tasks.value = res;
  });
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
      <div v-else>
        <div class="text-xs text-gray-600" v-if="tasks.length === 0">
          No tasks have been created for this story
        </div>
        <div v-else class="flex flex-col space-y-2">
          <TaskCard
            v-for="(task, idx) in tasks"
            :key="idx"
            :task="task"
            :projectId="projectId"
          />
        </div>
      </div>
    </div>
    <div>
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
