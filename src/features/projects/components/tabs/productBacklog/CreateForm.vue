<script setup lang="ts">
import emitter from "@/plugins";
import { useField, useForm } from "vee-validate";
import { CreateStoryData, Project } from "@/features/projects";
import { useToast } from "vue-toast-notification";
import { useAxios } from "@/composables/useAxios";

type StoryCreateProps = {
  project: Project;
};

const props = defineProps<StoryCreateProps>();
console.log(props.project.id);

const { handleSubmit } = useForm({
  validationSchema: {
    name(value: string) {
      if (value) return true;

      return "Name is required!";
    },
    description(value: string) {
      if (value) return true;

      return "Description is required!";
    },
    business_value(value: number) {
      if (value) return true;

      return "Business value is required!";
    },
    priority(value: string) {
      if (value) return true;

      return "Priority is required!";
    },
    acceptance_criteria(value: string) {
      if (value) return true;

      return "Acceptance criteria is required!";
    },
  },
});

const name = useField<string>("name");
const description = useField<string>("description");
const business_value = useField<number>("business_value");
const priority = useField<string>("priority");
const acceptance_criteria = useField<string>("acceptance_criteria");

const { execute: submitStory } = useAxios({
  method: "post",
  url: "story/create",
});

const submit = handleSubmit((values: CreateStoryData) => {
  console.log(values);
  console.log("TEST");
  console.log(values.priority);

  submitStory({
    project_id: props.project.id,
    sprint_id: 14,
    name: values.name,
    description: values.description,
    business_value: values.business_value,
    priority: 0,
    acceptance_criteria: values.acceptance_criteria,
  }).then(() => {
    useToast().success("Successfully created new story!", {
      position: "top",
    });

    emitter.emit("dialogClose");
  });
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
      <v-text-field
        v-model="business_value.value.value"
        :error-messages="business_value.errorMessage.value"
        label="Business value"
        variant="outlined"
        no-resize
        class="w-full"
        type="number"
      ></v-text-field>
      <v-select
        v-model="priority.value.value"
        :error-messages="priority.errorMessage.value"
        label="Priority"
        variant="outlined"
        class="w-full"
        :items="[
          'COULD HAVE',
          'SHOULD HAVE',
          'MUST HAVE',
          `WON'T HAVE THIS TIME`,
        ]"
      ></v-select>
    </div>
    <v-textarea
      v-model="acceptance_criteria.value.value"
      :error-messages="acceptance_criteria.errorMessage.value"
      label="Acceptance criteria"
      variant="outlined"
      no-resize
      class="w-full"
    ></v-textarea>

    <div class="w-full flex justify-end">
      <v-btn
        prepend-icon="mdi-plus-circle"
        variant="flat"
        color="#5865f2"
        type="submit"
        class="w-2/5"
      >
        Create story
      </v-btn>
    </div>
  </form>
</template>
