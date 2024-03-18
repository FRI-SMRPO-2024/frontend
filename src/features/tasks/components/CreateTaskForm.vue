<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { CreateTaskData, Task } from "@/features/tasks/types";
import { useAxios } from "@/composables/useAxios";
import { Alert } from "@/components/Alert";
import { Loader } from "@/components/Common";
import { useToast } from "vue-toast-notification";
import { ProjectUser, UserSelect } from "@/features/projects";
import { onMounted, ref } from "vue";

type TaskFormProps = {
  storyId: number;
  projectId: number;
};

const props = defineProps<TaskFormProps>();

const emit = defineEmits(["taskAdded"]);

const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    description(value: string) {
      if (value) return true;

      return "Task description is required!";
    },
    time_estimation(value: number) {
      if (value) return true;

      return "Time estimation is required!";
    },
  },
});

const mapUsersToSelect = (projUsers: ProjectUser[]): UserSelect[] => {
  return projUsers.map((user: ProjectUser) => ({
    title: `${user.user.first_name} ${user.user.last_name}`,
    value: user.user.id,
  }));
};

const assignee = useField<string>("assignee");
const description = useField<string>("description");
const timeEstimation = useField<number>("time_estimation");

const assigneeUsers = ref<UserSelect[]>([]);

const {
  execute: submitTask,
  isLoading,
  isError,
  error,
} = useAxios<Task>({ method: "post", url: "task/create" });
const { execute: fetchUsers } = useAxios<ProjectUser[]>({
  method: "get",
  url: `user-project/get-project-users/${props.projectId}`,
});

onMounted(() => {
  fetchUsers().then((res: ProjectUser[]) => {
    assigneeUsers.value = mapUsersToSelect(res);
  });
});

const submit = handleSubmit((values: CreateTaskData) => {
  submitTask({
    story_id: props.storyId,
    description: values.description,
    assignee_id: values.assignee ?? null,
    time_estimation: values.time_estimation,
  }).then((res: Task) => {
    useToast().success("Successfully added a new task!", { position: "top" });
    handleReset();
    emit("taskAdded", res);
  });
});
</script>

<template>
  <Alert v-if="isError" :message="error.message.error" type="error" />
  <form fast-fail @submit.prevent="submit">
    <v-text-field
      v-model="description.value.value"
      :error-messages="description.errorMessage.value"
      label="Description"
      variant="outlined"
      class="w-full"
      density="compact"
    ></v-text-field>
    <div class="flex justify-between items-center space-x-2">
      <v-text-field
        v-model="timeEstimation.value.value"
        :error-messages="timeEstimation.errorMessage.value"
        label="Time estimation (Hours)"
        variant="outlined"
        type="number"
        :min="1"
        density="compact"
        class="w-2/4"
      >
      </v-text-field>
      <v-select
        v-model="assignee.value.value"
        label="Assignee"
        variant="outlined"
        density="compact"
        class="w-2/4"
        :items="assigneeUsers"
      ></v-select>
    </div>
    <div class="w-full flex justify-end">
      <v-btn
        prepend-icon="mdi-plus-circle"
        variant="flat"
        color="#5865f2"
        type="submit"
        class="h-full"
      >
        Add task
      </v-btn>
    </div>
  </form>
  <div v-if="isLoading" class="flex justify-center mt-2">
    <Loader />
  </div>
</template>
