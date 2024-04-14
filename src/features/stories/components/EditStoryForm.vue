<script setup lang="ts">
import emitter from "@/plugins";
import { useField, useForm } from "vee-validate";
import { useToast } from "vue-toast-notification";
import { useAxios } from "@/composables/useAxios";
import { Alert } from "@/components/Alert";
import { Loader } from "@/components/Common";
import { CreateStoryData, Story } from "@/features/stories";

const emit = defineEmits(["update-story", "dialogClose"]);

type StoryEditProps = {
  story: Story;
};

const props = defineProps<StoryEditProps>();

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

const name = useField<string>("name", {}, { initialValue: props.story.name });
const description = useField<string>(
  "description",
  {},
  { initialValue: props.story.description },
);
const business_value = useField<number>(
  "business_value",
  {},
  { initialValue: props.story.business_value },
);
const priority = useField<string>(
  "priority",
  {},
  { initialValue: props.story.priority },
);
const acceptance_criteria = useField<string>(
  "acceptance_criteria",
  {},
  { initialValue: props.story.acceptance_criteria },
);

let {
  execute: updateStory,
  error,
  isLoading,
  isError,
} = useAxios<Story>({
  method: "put",
  url: `story/update/${props.story.id}`,
});

const mapPriority = new Map([
  ["COULD HAVE", "COULD_HAVE"],
  ["SHOULD HAVE", "SHOULD_HAVE"],
  ["MUST HAVE", "MUST_HAVE"],
  ["WON'T HAVE THIS TIME", "WONT_HAVE_THIS_TIME"],
]);

const submit = handleSubmit((values: CreateStoryData) => {
  updateStory({
    name: values.name,
    description: values.description,
    business_value: values.business_value,
    priority: mapPriority.get(values.priority),
    acceptance_criteria: values.acceptance_criteria,
  }).then((res: Story) => {
    useToast().success("Successfully updated a story!", {
      position: "top",
    });

    emitter.emit("dialogClose");
    emit("update-story", res);
  });
});
</script>

<template>
  <Alert
    v-if="isError"
    :message="error.message.error"
    type="error"
    class="mt-2 mb-2"
  />
  <form fast-fail @submit.prevent="submit">
    <v-text-field
      v-model="name.value.value"
      :error-messages="name.errorMessage.value"
      label="Name"
      variant="outlined"
      class="w-full"
      density="compact"
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
      <v-text-field
        v-model="business_value.value.value"
        :error-messages="business_value.errorMessage.value"
        label="Business value"
        variant="outlined"
        no-resize
        density="compact"
        class="w-full"
        type="number"
      ></v-text-field>
      <v-select
        v-model="priority.value.value"
        :error-messages="priority.errorMessage.value"
        label="Priority"
        variant="outlined"
        density="compact"
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
      density="compact"
      no-resize
      class="w-full"
    ></v-textarea>

    <div class="w-full flex justify-end">
      <v-btn variant="flat" color="#5865f2" type="submit" class="w-2/5">
        Edit
      </v-btn>
    </div>
  </form>
  <div v-if="isLoading" class="flex justify-center mt-2">
    <Loader />
  </div>
</template>
