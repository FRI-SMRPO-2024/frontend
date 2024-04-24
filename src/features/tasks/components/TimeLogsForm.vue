<script setup lang="ts">
import { Task, TimeLog } from "../types";
import { toRefs } from "vue";
import { TimeLogCard } from "@/features/tasks/components";

const props = defineProps<{
  timeLogs: TimeLog[];
  task: Task;
}>();

const { timeLogs } = toRefs(props);

const addTimeLog = () => {
  const newLog = {
    id: -1, // Temporary ID
    task_id: props.task.id,
    user_id: "", // Set this to the appropriate user ID
    date: new Date().toISOString().split("T")[0],
    time_from: "00:00:00",
    time_to: "00:00:00",
    description: "",
    estimated_time_left: 0,
    created_at: new Date().toISOString(),
  };
  timeLogs.value.push(newLog);
};

// emitter.on(
//   `timeLogEdited${props.timeLg}`,
//   ({
//     taskId,
//     description,
//     edited,
//   }: {
//     taskId: number;
//     description: string;
//     edited: boolean;
//   }) => {
//     console.log(taskId, description, edited);
//     if (taskId !== props.task.task.id) {
//       return;
//     }

//     editMode.value = false;
//     optionsMenu.value = false;

//     if (edited) {
//       taskDescription.value = description;
//     }
//   },
// );

// const updateTimeLog = (payload: { index: number; timeLog: TimeLog }) => {
//   props.timeLogs[payload.index] = payload.timeLog;
// };

// const removeTimeLog = (index: number) => {
//   props.timeLogs.splice(index, 1);
// };
</script>

<template>
  <TimeLogCard
    v-for="(log, index) in timeLogs"
    :key="log.id"
    :timeLog="log"
    :index="index"
    :taskId="task.id"
  />
  <v-btn color="primary" @click="addTimeLog"> Add Time Log </v-btn>
</template>
