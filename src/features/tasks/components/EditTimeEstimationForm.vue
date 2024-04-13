<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import emitter from "@/plugins";
import { useAxios } from "@/composables/useAxios";
import { useToast } from "vue-toast-notification";
import { Alert } from "@/components/Alert";
import { Loader } from "@/components/Common";

const props = defineProps<{
  taskId: number;
  idx: number;
  estimation?: number;
}>();

const { handleSubmit } = useForm({
  validationSchema: {
    timeEstimation(value: number) {
      if (value) return true;

      return "Time value is required!";
    },
  },
});

const timeEstimation = useField<number>("timeEstimation");

if (props.estimation) {
  timeEstimation.value.value = props.estimation;
}

const {
  execute: update,
  isLoading,
  isError,
  error,
} = useAxios({
  method: "put",
  url: `task/update/${props.taskId}`,
});

const submit = handleSubmit((values: { timeEstimation: number }) => {
  update({
    time_estimation: values.timeEstimation,
  }).then(() => {
    useToast().success("Successfully changed time estimation!", {
      position: "top",
    });

    emitter.emit(`menuClosePoint${props.idx}`, {
      taskId: props.taskId,
      timeEstimation: values.timeEstimation,
    });
  });
});
</script>

<template>
  <Alert v-if="isError" :message="error.message.error" type="error" />
  <form fast-fail @submit.prevent="submit">
    <v-text-field
      v-model="timeEstimation.value.value"
      :error-messages="timeEstimation.errorMessage.value"
      label="Time estimation"
      variant="outlined"
      placeholder="Time estimation"
      density="compact"
      type="number"
      :min="0"
      class="w-full mt-2"
    ></v-text-field>
    <div class="justify-end">
      <v-btn
        prepend-icon="mdi-timer-outline"
        variant="flat"
        color="#5865f2"
        type="submit"
        class="w-2/5"
      >
        Set
      </v-btn>
    </div>
  </form>
  <div v-if="isLoading" class="flex justify-center mt-2">
    <Loader />
  </div>
</template>
