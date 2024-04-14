<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { useToast } from "vue-toast-notification";
import { useAxios } from "@/composables/useAxios";
import { Alert } from "@/components/Alert";
import { Loader } from "@/components/Common";
import { Story } from "@/features/stories";

const emit = defineEmits(["reject-story", "dialogClose"]);

type StoryRejectProps = {
  storyId: number;
};

const props = defineProps<StoryRejectProps>();

const { handleSubmit } = useForm({
  validationSchema: {
    rejected_comment(value: string) {
      if (value) return true;

      return "Reason is required!";
    },
  },
});

const rejected_comment = useField<string>("rejected_comment");

let {
  execute: updateStory,
  error,
  isLoading,
  isError,
} = useAxios<Story>({
  method: "put",
  url: `story/update/${props.storyId}`,
});

const submit = handleSubmit((values: { rejected_comment: string }) => {
  updateStory({
    status: "PRODUCT",
    rejected_comment: values.rejected_comment,
  }).then(() => {
    useToast().success("Successfully rejected a story!", {
      position: "top",
    });

    emit("dialogClose");
    emit("reject-story", props.storyId);
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
    <v-textarea
      v-model="rejected_comment.value.value"
      :error-messages="rejected_comment.errorMessage.value"
      label="Reason"
      variant="outlined"
      density="compact"
      no-resize
      class="w-full"
    ></v-textarea>
    <div class="w-full flex justify-end">
      <v-btn variant="flat" color="#5865f2" type="submit" class="w-2/5">
        Submit
      </v-btn>
    </div>
  </form>
  <div v-if="isLoading" class="flex justify-center mt-2">
    <Loader />
  </div>
</template>
