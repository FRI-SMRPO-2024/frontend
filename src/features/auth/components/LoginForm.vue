<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

import { BaseForm, InputField } from "@/components/Form";
import { LoginFormData } from "../types";

const validationSchema = toTypedSchema(
  z.object({
    email: z.string().min(1, "Required").email("Must be an email!"),
    password: z.string().min(1, "Required"),
  }),
);

async function onSubmit(values: LoginFormData) {
  console.log(values);

  // TODO: Connect to API
}
</script>

<template>
  <BaseForm @submit="onSubmit" :validation-schema="validationSchema">
    <InputField name="email" type="email" label="Email Address" />
    <InputField name="password" type="password" label="Password" />
    <v-btn
      prepend-icon="mdi-login"
      variant="flat"
      color="#5865f2"
      type="submit"
      class="w-full"
    >
      Login
    </v-btn>
  </BaseForm>
</template>
