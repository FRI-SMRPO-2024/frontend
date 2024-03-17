<script setup lang="ts">
import emitter from "@/plugins";
import { useField, useForm } from "vee-validate";
import { CreateProjectData, Project, UserSelect } from "@/features/projects";
import { User } from "@/features/users";
import { useAxios } from "@/composables/useAxios";
import { onMounted, ref } from "vue";
import { Alert } from "@/components/Alert";
import { Loader } from "@/components/Common";
import { useToast } from "vue-toast-notification";

const mapUsersToSelect = (users: User[]): UserSelect[] => {
  return users.map((user: User) => ({
    title: `${user.first_name} ${user.last_name}`,
    value: user.id,
  }));
};

const fetchedUsers = ref<UserSelect[]>([]);

const { execute: fetchUsers } = useAxios<User[]>({
  method: "get",
  url: "user/get-all",
});

onMounted(() => {
  fetchUsers().then((users: User[]) => {
    fetchedUsers.value = mapUsersToSelect(users);
  });
});

const { handleSubmit } = useForm({
  validationSchema: {
    name(value: number) {
      if (value) return true;

      return "Name is required!";
    },
    description(value: number) {
      if (value) return true;

      return "Description is required!";
    },
    productOwner(value: number) {
      if (
        value === scrumMaster.value.value ||
        developers.value.value.includes(value)
      ) {
        return "Product Owner can't also be Methodology Owner or Developer!";
      } else if (value) return true;

      return "Product Owner must be defined!";
    },
    scrumMaster(value: number) {
      if (value === productOwner.value.value) {
        return "Methodology Owner can't also be Product Owner!";
      } else if (value) return true;

      return "Methodology Owner must be defined!";
    },
    developers(value: number[]) {
      if (value.includes(productOwner.value.value)) {
        return "Developer can't also be Product Owner!";
      }
      if (value.length > 0) return true;

      return "At least one developer must be assigned!";
    },
  },
});

const name = useField<string>("name");
const description = useField<string>("description");
const productOwner = useField<number>("productOwner");
const scrumMaster = useField<number>("scrumMaster");
const developers = useField<number[]>("developers", {}, { initialValue: [] });

const {
  execute: submitProject,
  isLoading,
  isError,
  error,
} = useAxios<Project>({ method: "post", url: "project/create" });

const submit = handleSubmit((values: CreateProjectData) => {
  submitProject({
    name: values.name,
    description: values.description,
    owner_id: values.productOwner,
    scrum_master: values.scrumMaster,
    developers: values.developers,
  }).then(() => {
    useToast().success("Successfully created new project!", {
      position: "top",
    });
    emitter.emit("dialogClose");
  });
});
</script>

<template>
  <Alert
    v-if="isError"
    :message="error.message.error"
    type="error"
    class="mb-4"
  />
  <form fast-fail @submit.prevent="submit">
    <v-text-field
      v-model="name.value.value"
      :error-messages="name.errorMessage.value"
      label="Name"
      density="compact"
      variant="outlined"
      class="w-full"
    ></v-text-field>
    <v-textarea
      v-model="description.value.value"
      :error-messages="description.errorMessage.value"
      label="Description"
      variant="outlined"
      density="compact"
      no-resize
      class="w-full"
    ></v-textarea>
    <div class="flex items-center w-full justify-between space-x-4">
      <v-select
        v-model="productOwner.value.value"
        :error-messages="productOwner.errorMessage.value"
        label="Product Owner"
        variant="outlined"
        class="w-full"
        density="compact"
        :items="fetchedUsers"
      ></v-select>
      <v-select
        v-model="scrumMaster.value.value"
        :error-messages="scrumMaster.errorMessage.value"
        label="Methodology Owner"
        variant="outlined"
        class="w-full"
        density="compact"
        :items="fetchedUsers"
      ></v-select>
    </div>
    <v-select
      v-model="developers.value.value"
      :error-messages="developers.errorMessage.value"
      label="Developers"
      variant="outlined"
      density="compact"
      class="w-full"
      multiple
      :items="fetchedUsers"
    ></v-select>
    <div class="w-full flex justify-end">
      <v-btn
        prepend-icon="mdi-plus-circle"
        variant="flat"
        color="#5865f2"
        type="submit"
        class="w-2/5"
      >
        Create project
      </v-btn>
    </div>
  </form>
  <div v-if="isLoading" class="mt-2 flex justify-center">
    <Loader />
  </div>
</template>
