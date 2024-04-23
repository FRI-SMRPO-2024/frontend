<script setup lang="ts">
import { ref, toRefs } from "vue";
import { useAxios } from "@/composables/useAxios";
import { useToast } from "vue-toast-notification";
import { Task, TimeLog, TimeLogUpdate } from "../types";
import { useUserStore } from "@/stores/user.store";
import emitter from "@/plugins";

const props = defineProps<{
  timeLog: TimeLog;
  index: number;
  task: Task;
}>();

const { timeLog } = toRefs(props);

// const localTimeLog = computed({
//   get: () => ({
//     ...timeLog.value
//   }),
//   set: (val) => {
//     // Here, instead of mutating the prop, you emit an event
//     // This can be caught by the parent to update the source of truth
//     emitter.emit('update:timeLog', val);
//   }
// });

const editableTimeLog = ref(JSON.parse(JSON.stringify(timeLog.value)));

// const { handleSubmit, resetForm } = useForm();
// const {
//   value: description,
// } = useField('description');
// const {
//   value: time_from,
// } = useField('time_from');
// const {
//   value: time_to,
// } = useField('time_to');

const { execute: updateTimeLog } = useAxios({
  method: "put",
  url: `time-log/update/${props.task.id}`,
});

// const saveTimeLog = async (timeLog: TimeLog) => {
//   const timeLogUpdate: TimeLogUpdate = {
//     task_id: props.task.id,
//     user_id: useUserStore().getData()?.id ?? "",
//     description: timeLog.description,
//     date: timeLog.date,
//     time_from: timeLog.time_from,
//     time_to: timeLog.time_to,
//     estimated_time_left: timeLog.estimated_time_left
//   };
//   updateTimeLog(timeLogUpdate).then(() => {
//     useToast().success("Time log saved successfully!", {
//       position: "top",
//     });
//   });
// }

const saveTimeLog = async () => {
  // Make sure to use the local copy for updates
  const timeLogUpdate: TimeLogUpdate = {
    task_id: props.task.id,
    user_id: useUserStore().getData()?.id ?? "",
    description: editableTimeLog.value.escription,
    date: editableTimeLog.value.date,
    time_from: editableTimeLog.value.time_from,
    time_to: editableTimeLog.value.time_to,
    estimated_time_left: editableTimeLog.value.estimated_time_left,
  };

  updateTimeLog(timeLogUpdate).then(() => {
    useToast().success("Time log saved successfully!", {
      position: "top",
    });
    // Emit an event to inform the parent component of the update
    emitter.emit("timeLogUpdated", {
      index: props.index,
      timeLog: timeLogUpdate,
    });
  });
};
</script>

<template>
  <div class="flex justify-between items-center gap-x-2 text-sm">
    <div
      class="grow px-4 py-3 border rounded-md flex justify-between items-center"
    >
      <div>
        <v-text-field
          placeholder="Enter description"
          dense
          solo
          flat
        ></v-text-field>
      </div>
      <div>
        <v-date-picker dense solo flat></v-date-picker>
      </div>
      <div>
        <v-text-field
          placeholder="HH:MM"
          dense
          solo
          flat
          type="time"
        ></v-text-field>
      </div>
      <div>
        <v-text-field
          placeholder="HH:MM"
          dense
          solo
          flat
          type="time"
        ></v-text-field>
      </div>
      <div>
        <v-text-field
          placeholder="Enter estimated time left"
          dense
          solo
          flat
        ></v-text-field>
      </div>
      <div>
        <v-btn icon @click="saveTimeLog()">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <!-- <v-btn icon @click="removeTimeLog(index)">
          <v-icon>mdi-delete</v-icon>
        </v-btn> -->
      </div>
    </div>
  </div>
  <!-- <div v-if="updateLoading" class="flex justify-center mt-2">
    <Loader />
  </div> -->
</template>
