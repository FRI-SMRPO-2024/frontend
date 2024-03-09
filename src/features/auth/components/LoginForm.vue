<script setup lang="ts">
import { LoginFormData } from "../types";
import { useField, useForm } from "vee-validate";

const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    email(value) {
      if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true;

      return "Must be a valid e-mail.";
    },
    password(value) {
      if (value) return true;

      return "Password name is required!";
    },
  },
});

const email = useField("email");
const password = useField("password");

const submit = handleSubmit((values: LoginFormData) => {
  console.log(values);
  // TODO: Connect to API

  handleReset();
});
</script>

<template>
  <form fast-fail @submit.prevent="submit">
    <v-text-field
      v-model="email.value.value"
      variant="outlined"
      :error-messages="email.errorMessage.value"
      label="Email"
    ></v-text-field>
    <v-text-field
      v-model="password.value.value"
      :error-messages="password.errorMessage.value"
      label="Password"
      type="password"
      variant="outlined"
    ></v-text-field>
    <v-btn
      prepend-icon="mdi-login"
      variant="flat"
      color="#5865f2"
      type="submit"
      class="w-full"
    >
      Login
    </v-btn>
  </form>
</template>
