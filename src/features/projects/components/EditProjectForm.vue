<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import {
  CreateProjectData,
  Project,
  ProjectUser,
  UserSelect,
} from "@/features/projects";
import { User } from "@/features/users";
import { useAxios } from "@/composables/useAxios";
import { onMounted, ref } from "vue";
import { Alert } from "@/components/Alert";
import { Loader } from "@/components/Common";
import { useToast } from "vue-toast-notification";

type EditProjectFormProps = {
  project: Project;
};

const props = defineProps<EditProjectFormProps>();
const emits = defineEmits(["projectUpdated", "dialogClose"]);

const mapUsersToSelect = (users: User[]): UserSelect[] => {
  return users.map((user: User) => ({
    title: `${user.first_name} ${user.last_name}`,
    value: user.id,
  }));
};

const fetchedUsers = ref<UserSelect[]>([]);
const setDevelopers = ref<string[]>([]);

const { execute: fetchUsers } = useAxios<User[]>({
  method: "get",
  url: "user/get-all",
});

const { execute: fetchProjectUsers, isLoading: usersLoading } = useAxios<
  ProjectUser[]
>({
  method: "get",
  url: `user-project/get-project-users/${props.project.id}`,
});

onMounted(() => {
  fetchProjectUsers().then((res: ProjectUser[]) => {
    res.forEach((user: ProjectUser) => {
      if (user.roles.includes("SCRUM_MASTER")) {
        scrumMaster.value.value = user.user.id;
      }
      if (user.roles.includes("DEVELOPER")) {
        setDevelopers.value.push(user.user.id);
      }
    });
  });

  fetchUsers().then((users: User[]) => {
    fetchedUsers.value = mapUsersToSelect(users);
  });
});

const { handleSubmit } = useForm<CreateProjectData>({
  validationSchema: {
    name(value: number) {
      if (value) return true;

      return "Name is required!";
    },
    description(value: number) {
      if (value) return true;

      return "Description is required!";
    },
    productOwner(value: string) {
      if (
        value === scrumMaster.value.value ||
        developers.value.value.includes(value)
      ) {
        return "Product Owner can't also be Scrum Master or Developer!";
      } else if (value) return true;

      return "Product Owner must be defined!";
    },
    scrumMaster(value: string) {
      if (value === productOwner.value.value) {
        return "Scrum Master can't also be Product Owner!";
      } else if (value) return true;

      return "Scrum Master must be defined!";
    },
    developers(value: string[]) {
      if (value.includes(productOwner.value.value)) {
        return "Developer can't also be Product Owner!";
      }
      if (value.length > 0) return true;

      return "At least one developer must be assigned!";
    },
  },
});

const name = useField<string>("name", {}, { initialValue: props.project.name });
const description = useField<string>(
  "description",
  {},
  { initialValue: props.project.description },
);
const productOwner = useField<string>(
  "productOwner",
  {},
  { initialValue: props.project.owner_id },
);
const scrumMaster = useField<string>("scrumMaster");
const developers = useField<string[]>(
  "developers",
  {},
  { initialValue: setDevelopers.value },
);

const {
  execute: submitProject,
  isLoading,
  isError,
  error,
} = useAxios<Project>({ method: "put", url: `` });

const submit = handleSubmit((values: CreateProjectData) => {
  submitProject(
    {
      name: values.name,
      description: values.description,
      owner_id: values.productOwner,
      scrum_master: values.scrumMaster,
      developers: values.developers,
    },
    `project/update/${props.project.id}`,
  ).then(() => {
    useToast().success("Successfully updated a project!", {
      position: "top",
    });
    emits("dialogClose");
    emits("projectUpdated");
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
  <div v-if="usersLoading" class="w-full mt-2 flex justify-center">
    <Loader />
  </div>
  <form v-else fast-fail @submit.prevent="submit">
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
        label="Scrum Master"
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
      <v-btn variant="flat" color="#5865f2" type="submit" class="w-2/5">
        Edit
      </v-btn>
    </div>
  </form>
  <div v-if="isLoading" class="mt-2 flex justify-center">
    <Loader />
  </div>
</template>
