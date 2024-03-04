<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import {
  BaseForm,
  InputField,
  SelectField,
  TextareaField,
} from "@/components/Form";
import emitter from "@/plugins";
import { CreateProjectData } from "../types";

const validationSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, "Required"),
    description: z.string().min(1, "Required"),
    productOwner: z.string().min(1, "Required"),
    scrumMaster: z.string().min(1, "Required"),
  }),
);

async function onSubmit(values: CreateProjectData) {
  console.log(values);
  // TODO: Connect to API

  emitter.emit("dialogClose");
}
</script>

<template>
  <BaseForm @submit="onSubmit" :validation-schema="validationSchema">
    <InputField name="name" type="text" label="Title" />
    <TextareaField name="description" type="text" label="Description" />
    <div class="flex items-center w-full justify-between space-x-4">
      <SelectField
        name="productOwner"
        label="Product Owner"
        :options="[
          { label: 'User', value: 'user' },
          { label: 'Admin', value: 'admin' },
        ]"
        class="w-full"
      />
      <SelectField
        name="scrumMaster"
        label="Scrum Master"
        :options="[
          { label: '-- Select a user --', value: '' },
          { label: 'User', value: 'user' },
          { label: 'Admin', value: 'admin' },
        ]"
        class="w-full"
      />
    </div>

    <v-select
      label="Select developers"
      multiple
      :items="['neki', 'state', 'adijo', 'ok', 'seos']"
    />
    <div class="w-full flex justify-end">
      <v-btn
        prepend-icon="mdi-plus-circle"
        variant="flat"
        color="#5865f2"
        type="submit"
        class="w-2/5"
      >
        Create
      </v-btn>
    </div>
  </BaseForm>
</template>
