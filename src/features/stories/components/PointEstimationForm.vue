<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import emitter from "@/plugins";
import { useAxios } from "@/composables/useAxios";
import { useToast } from "vue-toast-notification";

const props = defineProps<{
  storyId: number;
  idx: number;
  estimation?: number;
}>();

const { handleSubmit } = useForm({
  validationSchema: {
    pointEstimation(value: number) {
      if (value) return true;

      return "Point value is required!";
    },
  },
});

const pointEstimation = useField<number>("pointEstimation");

if (props.estimation) {
  pointEstimation.value.value = props.estimation;
}

const { execute: update } = useAxios({
  method: "put",
  url: `story/update/${props.storyId}`,
});

const submit = handleSubmit((values: { pointEstimation: number }) => {
  update({
    point_estimation: values.pointEstimation,
  }).then(() => {
    useToast().success("Successfully changed point estimation!", {
      position: "top",
    });

    emitter.emit(`menuClosePoint${props.idx}`, {
      storyId: props.storyId,
      pointEstimation: values.pointEstimation,
    });
  });
});
</script>

<template>
  <form fast-fail @submit.prevent="submit">
    <v-text-field
      v-model="pointEstimation.value.value"
      :error-messages="pointEstimation.errorMessage.value"
      label="Point estimation"
      variant="outlined"
      placeholder="Point estimation"
      density="compact"
      type="number"
      :min="0"
      class="w-full"
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
</template>
