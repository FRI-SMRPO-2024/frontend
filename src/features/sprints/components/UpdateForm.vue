<script setup lang="ts">
import emitter from "@/plugins";
import { useField, useForm } from "vee-validate";
import { CreateSprintData } from "@/features/sprints";
import { useAxios } from "@/composables/useAxios";
import { useToast } from "vue-toast-notification";
import { ref } from "vue";

type SprintProps = {
  sprint_id: string;
  prop_velocity: string;
  prop_start_date: Date;
  prop_end_date: Date;
};

const props = defineProps<SprintProps>();
console.log(props.prop_velocity);
console.log(props.prop_start_date);
console.log(props.prop_end_date);
console.log(props.sprint_id);

const { handleSubmit } = useForm({
  validationSchema: {
    velocity(value: number) {
      if (value <= 0) {
        return "Velocity must be greater than 0!";
      }
      if (value) return true;

      return "Velocity is required!";
    },
    selectedEndDateField(value: Date) {
      if (value) return true;

      return "End date is required!";
    },
    selectedStartDateField(value: Date) {
      if (value) return true;

      return "Start date is required!";
    },
  },
});

const velocity = useField<number>("velocity");
let selectedEndDateField = useField<Date>("selectedEndDateField");
let selectedStartDateField = useField<Date>("selectedStartDateField");

velocity.value.value = Number(props.prop_velocity);
selectedStartDateField.value.value = new Date(props.prop_start_date);
selectedEndDateField.value.value = new Date(props.prop_end_date);

function test() {
  const start = new Date(
    selectedStartDateField.value.value -
      selectedStartDateField.value.value.getTimezoneOffset() * 60000,
  ).toISOString();
  if (selectedEndDateField.value.value) {
    const end = new Date(
      selectedEndDateField.value.value -
        selectedEndDateField.value.value.getTimezoneOffset() * 60000,
    ).toISOString();
    if (start >= end) {
      selectedEndDateField.value.value = undefined;
    }
  }
}

function disablePastDates(val) {
  if (val.getDay() === 0 || val.getDay() === 6) return false;
  val = new Date(val - val.getTimezoneOffset() * 60000).toISOString();
  const today = new Date().toISOString().substr(0, 10);
  return val >= today;
}

function disableDatesBeforeStart(val) {
  if (val.getDay() === 0 || val.getDay() === 6) return false;
  val = new Date(val - val.getTimezoneOffset() * 60000).toISOString();
  const limit = new Date(
    selectedStartDateField.value.value -
      selectedStartDateField.value.value.getTimezoneOffset() * 60000,
  ).toISOString();
  return val > limit;
}

let {
  execute: submitSprint,
  error,
  isError,
} = useAxios({
  method: "put",
  url: "sprint/update/" + props.sprint_id,
});

const submit = handleSubmit((values: CreateSprintData) => {
  submitSprint({
    velocity: values.velocity,
    start_date: new Date(
      selectedStartDateField.value.value -
        selectedStartDateField.value.value.getTimezoneOffset() * 60000,
    ),
    end_date: new Date(
      selectedEndDateField.value.value -
        selectedEndDateField.value.value.getTimezoneOffset() * 60000,
    ),
  }).then(() => {
    useToast().success("Successfully updated new sprint!", {
      position: "top",
    });

    isError = ref(false);
    emitter.emit("dialogClose");
  });
});
</script>

<template>
  <form fast-fail @submit.prevent="submit">
    <div class="w-full flex justify-space-between">
      <div>
        <v-date-picker
          title="Start date"
          v-model="selectedStartDateField.value.value"
          @click="test"
          :allowed-dates="disablePastDates"
        >
        </v-date-picker>
        <p style="color: red; text-decoration: underline">
          {{ selectedStartDateField.errorMessage.value }}
        </p>
      </div>
      <div>
        <v-date-picker
          title="End date"
          v-model="selectedEndDateField.value.value"
          :allowed-dates="disableDatesBeforeStart"
        >
        </v-date-picker>
        <p style="color: red; text-decoration: underline" class="text-end">
          {{ selectedEndDateField.errorMessage.value }}
          <br />
        </p>
      </div>
    </div>

    <div class="w-full flex justify-space-between mt-3">
      <div class="w-50 flex justify-start">
        <v-text-field
          density="compact"
          suffix="pts"
          hide-spin-buttons
          v-model="velocity.value.value"
          :error-messages="velocity.errorMessage.value"
          label="Velocity"
          variant="outlined"
          type="number"
          :min="1"
          :max="100"
        ></v-text-field>
      </div>
      <div class="w-50 flex justify-end">
        <v-btn
          prepend-icon="mdi-plus-circle"
          variant="flat"
          color="#5865f2"
          type="submit"
          class="w-66"
        >
          Update sprint
        </v-btn>
      </div>
    </div>
    <Alert v-if="isError" :message="error.message.error" type="error" />
  </form>
</template>
