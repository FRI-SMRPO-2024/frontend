<script setup lang="ts">
import { LoginFormData, LoginResponse } from "../types";
import { useField, useForm } from "vee-validate";
import { handleSuccessAuth, useAuthenticate } from "@/features/auth/api";
import Alert from "@/components/Alert/Alert.vue";
import { useRouter } from "vue-router";

const { mutate, isError, error } = useAuthenticate();
const router = useRouter();

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
  mutate(values, {
    onSuccess: (data: LoginResponse) => {
      // Router can't be used outside <script setup> so we have to define onSuccess here
      handleSuccessAuth(data);
      router.push({ name: "dashboard" });
    },
  });

  handleReset();
});
</script>

<template>
  <Alert
    v-if="isError"
    :message="error.response.data"
    type="error"
    class="mb-2"
  />
  <form fast-fail @submit="submit">
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
