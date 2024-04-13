<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { Task } from "@/features/tasks/types";
import { useAxios } from "@/composables/useAxios";
import { Alert } from "@/components/Alert";
import { Loader } from "@/components/Common";
import { useToast } from "vue-toast-notification";
import emitter from "@/plugins";

type TaskFormProps = {
  taskId: number;
  description: string;
};

const props = defineProps<TaskFormProps>();

const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    description(value: string) {
      if (value) return true;

      return "Task description is required!";
    },
  },
});

const {
  execute: updateTask,
  isLoading,
  isError,
  error,
} = useAxios<Task>({
  method: "put",
  url: `task/update/${props.taskId}`,
});

const description = useField<string>(
  "description",
  {},
  { initialValue: props.description },
);

const leaveEditMode = (
  taskId: number,
  description: string,
  edited: boolean,
) => {
  emitter.emit(`taskEdited${taskId}`, { taskId, description, edited });
};

const submit = handleSubmit((values: { description: string }) => {
  updateTask({
    description: values.description,
  }).then((res: Task) => {
    useToast().success("Successfully edited a task!", { position: "top" });
    handleReset();
    console.log(res);
    leaveEditMode(res.id, res.description, true);
  });
});
</script>
<template class="flex space-x-2 justify-start items-center">
  <Alert v-if="isError" :message="error.message.error" type="error" />
  <form
    fast-fail
    @submit.prevent="submit"
    class="flex w-full justify-start items-center space-x-3"
  >
    <v-text-field
      v-model="description.value.value"
      :error-messages="description.errorMessage.value"
      label="Description"
      variant="outlined"
      :hide-details="true"
      class="w-full grow"
      density="compact"
    ></v-text-field>
    <div class="shrink flex justify-start items-start space-x-1">
      <v-btn
        variant="flat"
        color="#5865f2"
        size="default"
        type="submit"
        class="w-full text-xs shrink"
      >
        Edit
      </v-btn>
      <v-btn
        variant="flat"
        size="default"
        color="#e8e8e8"
        class="w-full text-xs shrink"
        @click="leaveEditMode(taskId, '', false)"
      >
        Cancel
      </v-btn>
    </div>
  </form>
  <div v-if="isLoading" class="flex justify-center mt-2 ml-2">
    <Loader />
  </div>
</template>
