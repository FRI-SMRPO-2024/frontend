<script setup lang="ts">
import emitter from "@/plugins";
import { useField, useForm } from "vee-validate";
import { CreateProjectData, UserSelect } from "@/features/projects";
import { User, usersData } from "@/features/users";

const mapUsersToSelect = (users: User[]): UserSelect[] => {
  return users.map((user: User) => ({
    title: user.fullname,
    value: user.id,
  }));
};

const fetchedUsers = mapUsersToSelect(usersData);

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

const submit = handleSubmit((values: CreateProjectData) => {
  console.log(values);
  // TODO: Connect to API

  emitter.emit("dialogClose");
});
</script>

<template>
  <form fast-fail @submit.prevent="submit">
    <v-text-field
      v-model="name.value.value"
      :error-messages="name.errorMessage.value"
      label="Name"
      variant="outlined"
      class="w-full"
    ></v-text-field>
    <v-textarea
      v-model="description.value.value"
      :error-messages="description.errorMessage.value"
      label="Description"
      variant="outlined"
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
        :items="fetchedUsers"
      ></v-select>
      <v-select
        v-model="scrumMaster.value.value"
        :error-messages="scrumMaster.errorMessage.value"
        label="Methodology Owner"
        variant="outlined"
        class="w-full"
        :items="fetchedUsers"
      ></v-select>
    </div>
    <v-select
      v-model="developers.value.value"
      :error-messages="developers.errorMessage.value"
      label="Developers"
      variant="outlined"
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
        Create proejct
      </v-btn>
    </div>
  </form>
</template>
