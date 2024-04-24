<script setup lang="ts">
import { Task, TimeLog } from "../types";
import { toRefs } from "vue";
import { TimeLogCard } from "@/features/tasks/components";
import emitter from "@/plugins";
import { useAxios } from "@/composables/useAxios";
import { useUserStore } from "@/stores/user.store";

const props = defineProps<{
  timeLogs: TimeLog[];
  task: Task;
}>();

const { timeLogs } = toRefs(props);

const {
  execute: createTimeLog,
  isLoading: isLoadingCreate,
  isError: isErrorCreate,
  error: errorCreate,
} = useAxios({
  method: "post",
  url: `time-log/create`,
});

const addTimeLog = () => {
  const newLog = {
    id: -1, // Temporary ID
    task_id: props.task.id,
    user_id: useUserStore().getData()?.id ?? "",
    date: new Date().toISOString().split("T")[0],
    time_from: "00:00:00",
    time_to: "00:00:00",
    description: "",
    estimated_time_left: 0,
    created_at: new Date().toISOString(),
  };
  timeLogs.value.push(newLog);
  createTimeLog(newLog).then((res: TimeLog) => {
    timeLogs.value[timeLogs.value.length - 1] = res;
  });
};

emitter.on(
  `updateTimeLog${props.task.id}`,
  ({ index, timeLog }: { index: number; timeLog: TimeLog }) => {
    timeLogs.value[index] = timeLog;
  },
);

emitter.on(`removeTimeLog${props.task.id}`, (index: number) => {
  timeLogs.value.splice(index, 1);
});

emitter.on(`timeLogAdded${props.task.id}`, (timeLog: TimeLog) => {
  timeLogs.value.push(timeLog);
});

emitter.on(`timeLogEdited${props.task.id}`, (timeLog: TimeLog) => {
  const index = timeLogs.value.findIndex((log) => log.id === timeLog.id);
  timeLogs.value[index] = timeLog;
});
</script>

<template>
  <Alert
    v-if="isErrorCreate"
    :message="errorCreate.message.error"
    type="error"
  />
  <TimeLogCard
    v-for="(log, index) in timeLogs"
    :key="log.id"
    :timeLog="log"
    :index="index"
    :taskId="task.id"
  />
  <v-btn color="primary" @click="addTimeLog"> Add Time Log </v-btn>
  <div v-if="isLoadingCreate" class="flex justify-center mt-2">
    <Loader />
  </div>
</template>
