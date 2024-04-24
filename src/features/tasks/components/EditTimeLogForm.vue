<script setup lang="ts">
import { useAxios } from "@/composables/useAxios";
import { useToast } from "vue-toast-notification";
import { TimeLog, TimeLogCreate, TimeLogUpdate } from "../types";
import { useUserStore } from "@/stores/user.store";
import emitter from "@/plugins";
import { useField, useForm } from "vee-validate";

const props = defineProps<{
  timeLog: TimeLog;
  index: number;
  taskId: number;
}>();

const leaveEditMode = (
  timeLogId: number,
  timeLog: TimeLog,
  edited: boolean,
) => {
  emitter.emit(`timeLogEdited${timeLogId}`, { timeLogId, timeLog, edited });
};

const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    description(value: string) {
      if (value) return true;

      return "Task description is required!";
    },
    estimated_time_left(value: string) {
      if (value) return true;

      return "Task estimated_time_left is required!";
    },
    time_from(value: string) {
      if (value) return true;

      return "Task time_from is required!";
    },
    time_to(value: string) {
      if (value) return true;

      return "Task time_to is required!";
    },
  },
});

const description = useField<string>(
  "description",
  {},
  { initialValue: props.timeLog.description },
);
const estimated_time_left = useField<number>(
  "estimated_time_left",
  {},
  { initialValue: props.timeLog.estimated_time_left },
);

const time_from = useField<string>(
  "time_from",
  {},
  { initialValue: props.timeLog.time_from },
);
const time_to = useField<string>(
  "time_to",
  {},
  { initialValue: props.timeLog.time_to },
);

const {
  execute: updateTimeLog,
  isLoading: isLoadingUpdate,
  isError: isErrorUpdate,
  error: errorUpdate,
} = useAxios({
  method: "put",
  url: `time-log/update/${props.timeLog.id}`,
});

const {
  execute: createTimeLog,
  isLoading: isLoadingCreate,
  isError: isErrorCreate,
  error: errorCreate,
} = useAxios({
  method: "post",
  url: `time-log/create`,
});

const submit = handleSubmit(
  (values: {
    description: string;
    time_from: string;
    time_to: string;
    estimated_time_left: number;
  }) => {
    console.log(values);

    if (props.timeLog.id === -1) {
      const timeLogCreate: TimeLogCreate = {
        task_id: props.taskId,
        user_id: useUserStore().getData()?.id ?? "",
        description: values.description,
        date: props.timeLog.date,
        time_from: values.time_from,
        time_to: values.time_to,
        estimated_time_left: values.estimated_time_left,
      };
      createTimeLog(timeLogCreate).then((res: TimeLog) => {
        console.log(res);
        useToast().success("Time log created successfully!", {
          position: "top",
        });
        handleReset();
        leaveEditMode(res.id, res, true);

        // Emit an event to inform the parent component of the update
        emitter.emit(`timeLogCreated${res.id}`, {
          index: props.index,
          timeLog: res,
        });
      });
    } else {
      const timeLogUpdate: TimeLogUpdate = {
        task_id: props.taskId,
        user_id: useUserStore().getData()?.id ?? "",
        description: values.description,
        date: props.timeLog.date,
        time_from: values.time_from,
        time_to: values.time_to,
        estimated_time_left: values.estimated_time_left,
      };
      updateTimeLog(timeLogUpdate).then((res: TimeLog) => {
        console.log(res);

        useToast().success("Time log saved successfully!", {
          position: "top",
        });
        handleReset();
        leaveEditMode(res.id, res, true);

        // Emit an event to inform the parent component of the update
        emitter.emit(`timeLogUpdated${res.id}`, {
          index: props.index,
          timeLog: res,
        });
      });
    }
  },
);
</script>

<template>
  <Alert
    v-if="isErrorUpdate"
    :message="errorUpdate.message.error"
    type="error"
  />
  <Alert
    v-if="isErrorCreate"
    :message="errorCreate.message.error"
    type="error"
  />
  <form
    fast-fail
    @submit.prevent="submit"
    class="flex w-full justify-start items-center space-x-3"
  >
    <v-text-field
      v-model="description.value.value"
      label="Description"
      variant="outlined"
      :hide-details="true"
      density="compact"
    ></v-text-field>
    <v-text-field
      v-model="time_from.value.value"
      placeholder="HH:MM"
      label="Time From"
      variant="outlined"
      :hide-details="true"
      density="compact"
      type="time"
    ></v-text-field>

    <v-text-field
      v-model="time_to.value.value"
      placeholder="HH:MM"
      label="Time To"
      variant="outlined"
      :hide-details="true"
      density="compact"
      type="time"
    ></v-text-field>

    <v-text-field
      v-model="estimated_time_left.value.value"
      label="Estimated time left"
      variant="outlined"
      :hide-details="true"
      density="compact"
      type="number"
    ></v-text-field>
    <div class="space-x-1 flex">
      <v-btn
        variant="flat"
        size="default"
        color="#5865f2"
        type="submit"
        class="w-full text-xs shrink"
      >
        Save
      </v-btn>
      <v-btn
        variant="flat"
        size="default"
        color="#e8e8e8"
        class="w-full text-xs shrink"
        @click="leaveEditMode(props.timeLog.id, props.timeLog, false)"
      >
        Cancel
      </v-btn>
    </div>
    `
  </form>
  <div
    v-if="isLoadingCreate || isLoadingUpdate"
    class="flex justify-center mt-2"
  >
    <Loader />
  </div>
</template>
