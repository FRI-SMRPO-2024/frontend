<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import emitter from "@/plugins";

const props = defineProps<{ storyId: number; estimation?: number }>();

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

const submit = handleSubmit((values: { timeEstimation: number }) => {
  console.log(values);
  // Connect to backend
  emitter.emit("menuClose", {
    storyId: props.storyId,
    timeEstimation: values.timeEstimation,
  });
});
</script>

<template>
  <form fast-fail @submit.prevent="submit">
    <v-text-field
      v-model="timeEstimation.value.value"
      :error-messages="timeEstimation.errorMessage.value"
      label="Time estimation"
      variant="outlined"
      density="compact"
      type="number"
      :min="0"
      class="w-full"
    ></v-text-field>
    <div class="flex justify-end">
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
</template>
