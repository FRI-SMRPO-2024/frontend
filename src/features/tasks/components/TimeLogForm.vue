<script setup lang="ts">
import { Task, TimeLog } from "../types";
import TimeLogCard from "./TimeLogCard.vue";
import { toRefs } from "vue";

const props = defineProps<{
  timeLogs: TimeLog[];
  task: Task;
}>();

const { timeLogs } = toRefs(props);


const addTimeLog = () => {
  const newLog = {
    id: Date.now(), // Temporary ID
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

// const removeTimeLog = (index: number) => {
//   timeLogs.value.splice(index, 1);
// };

// emitter.on("timeLogUpdated", ({ index, timeLog }) => {
//   // Replace the item at the given index with the updated data
//   timeLogs.value.splice(index, 1, timeLog);
// });
</script>

<template>
  <div>
    <TimeLogCard
      v-for="(timeLog, index) in timeLogs"
      :key="timeLog.id"
      :timeLog="timeLog"
      :task="props.task"
      :index="index"
    />
    <v-btn color="primary" class="ma-2" @click="addTimeLog()">
      Add Time Log
    </v-btn>
  </div>
</template>
