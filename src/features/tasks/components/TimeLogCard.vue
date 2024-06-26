<script setup lang="ts">
import { ref } from "vue";
import { useAxios } from "@/composables/useAxios";
import { useToast } from "vue-toast-notification";
import { TimeLog } from "../types";
import emitter from "@/plugins";
import { EditTimeLogForm } from "@/features/tasks/components";

const props = defineProps<{
  timeLog: TimeLog;
  index: number;
  taskId: number;
}>();

const timeLogRef = ref<TimeLog>(props.timeLog);
const editMode = ref<boolean>(false);

emitter.on(
  `timeLogEdited${props.timeLog.id}`,
  ({
    timeLogId,
    timeLog,
    edited,
  }: {
    timeLogId: number;
    timeLog: TimeLog;
    edited: boolean;
  }) => {
    console.log(timeLogId, timeLog, edited);
    if (timeLogId !== timeLogRef.value.id) {
      return;
    }

    editMode.value = false;

    if (edited) {
      timeLogRef.value = timeLog;
      emitter.emit(`updateTimeLog${props.taskId}`, {
        index: props.index,
        timeLog,
      });
    }
  },
);

const {
  execute: deleteTimeLog,
  isLoading: isLoadingDelete,
  isError: isErrorDelete,
  error: errorDelete,
} = useAxios({
  method: "delete",
  url: `time-log/delete/${props.timeLog.id}`,
});

const removeTimeLog = async () => {
  deleteTimeLog().then(() => {
    useToast().success("Time log deleted successfully!", {
      position: "top",
    });
    emitter.emit(`removeTimeLog${props.taskId}`, props.index);
  });
};
</script>

<template>
  <Alert
    v-if="isErrorDelete"
    :message="errorDelete.message.error"
    type="error"
  />
  <div class="flex w-[1000px] gap-x-2 text-sm mb-4">
    <div class="grow px-4 py-3 border rounded-md">
      <div
        v-if="!editMode"
        class="flex w-full justify-start items-center space-x-3"
      >
        <!-- <p class="text-sm w-full">
          Description : {{ props.timeLog.description }}
        </p>
        <p class="text-xs text-gray-500 w-full">
          Time From - Time To : {{ props.timeLog.time_from }} -
          {{ props.timeLog.time_to }}
        </p>
        <p class="text-xs text-gray-500 w-full">
          Estimated Time Left :{{ props.timeLog.estimated_time_left }}
        </p> -->
        <p class="text-sm w-full">Description : {{ timeLogRef.description }}</p>
        <p class="text-xs text-gray-500 w-full">
          Time From - Time To : {{ timeLogRef.time_from }} -
          {{ timeLogRef.time_to }}
        </p>
        <p class="text-xs text-gray-500 w-full">
          Estimated Time Left :{{ timeLogRef.estimated_time_left }}
        </p>
        <div class="flex justify-start items-center space-x-1">
          <v-btn
            variant="flat"
            color="#5865f2"
            size="default"
            class="text-xs"
            @click="editMode = true"
          >
            Edit
          </v-btn>
        </div>
      </div>
      <EditTimeLogForm
        v-else
        :task-id="props.taskId"
        :time-log="timeLogRef"
        :index="props.index"
        @leaveEditMode="editMode = false"
      />
    </div>
    <div class="flex justify-start items-center space-x-1">
      <v-btn
        variant="flat"
        color="#e8e8e8"
        size="default"
        class="text-xs"
        @click="removeTimeLog()"
      >
        Remove
      </v-btn>
    </div>
  </div>
  <div v-if="isLoadingDelete" class="flex justify-center mt-2">
    <Loader />
  </div>
</template>
