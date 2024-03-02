<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { BaseForm, InputField, SelectField } from "@/components/Form";
import { CreateUserData } from "../types";

const validationSchema = toTypedSchema(
  z.object({
    username: z.string().min(1, "Required"),
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    email: z.string().min(1, "Required").email("Must be an email"),
    password: z.string().min(12, "Required"),
    role: z.string().min(1, "Required"),
  }),
);

async function onSubmit(values: CreateUserData) {
  console.log(values);
  // TODO: Connect to API
  // TODO: Close Dialog on submit
}
</script>

<template>
  <BaseForm @submit="onSubmit" :validation-schema="validationSchema">
    <div class="flex items-center w-full justify-between space-x-4">
      <InputField
        name="firstName"
        type="text"
        label="First Name"
        class="w-full"
      />
      <InputField
        name="lastName"
        type="text"
        label="Last Name"
        class="w-full"
      />
    </div>
    <InputField name="email" type="email" label="Email Address" />
    <InputField name="username" type="text" label="Userame" />
    <InputField name="password" type="password" label="Password" />
    <SelectField
      name="role"
      label="Role"
      :options="[
        { label: 'User', value: 'user' },
        { label: 'Admin', value: 'admin' },
      ]"
      value="user"
    />
    <div class="w-full flex justify-end">
      <v-btn
        prepend-icon="mdi-plus-circle"
        variant="tonal"
        type="submit"
        class="w-2/5"
      >
        Create
      </v-btn>
    </div>
  </BaseForm>
</template>
