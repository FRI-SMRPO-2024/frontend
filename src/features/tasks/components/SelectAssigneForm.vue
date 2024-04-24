<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { useAxios } from "@/composables/useAxios";
import { ProjectUser, UserSelect } from "@/features/projects";
import { onMounted, ref } from "vue";
import { Alert } from "@/components/Alert";
import { Loader } from "@/components/Common";

type AssigneeFormProps = {
  projectId: number;
  assignedUserId: string | null;
};

const props = defineProps<AssigneeFormProps>();
const emit = defineEmits(["selectedUser"]);

const { handleSubmit } = useForm();

const user = useField<string>(
  "user",
  {},
  { initialValue: props.assignedUserId ?? "" },
);

const assigneeUsers = ref<UserSelect[]>([]);
const mapUsersToSelect = (projUsers: ProjectUser[]): UserSelect[] => {
  return projUsers.map((user: ProjectUser) => ({
    title: `${user.user.first_name} ${user.user.last_name}`,
    value: user.user.id,
  }));
};
const {
  execute: fetchUsers,
  isLoading,
  isError,
  error,
} = useAxios<ProjectUser[]>({
  method: "get",
  url: `user-project/get-project-users/${props.projectId}`,
});

onMounted(() => {
  fetchUsers().then((res: ProjectUser[]) => {
    res = res.filter(obj => !obj.roles.includes("OWNER"));
    assigneeUsers.value = mapUsersToSelect(res);
  });
});

const submit = handleSubmit((values: { user: string | null }) => {
  emit("selectedUser", values);
});
</script>

<template>
  <Alert v-if="isError" :message="error.message.error" type="error" />
  <div v-if="isLoading" class="flex justify-center">
    <Loader />
  </div>
  <form v-else fast-fail @submit.prevent="submit" class="mt-2">
    <v-select
      v-model="user.value.value"
      label="Assignee"
      variant="outlined"
      class="shrink"
      clearable
      density="compact"
      :items="assigneeUsers"
    ></v-select>
    <div class="w-full flex justify-end">
      <v-btn
        prepend-icon="mdi-plus-circle"
        variant="flat"
        color="#5865f2"
        type="submit"
        class="h-full"
      >
        Select
      </v-btn>
    </div>
  </form>
</template>
