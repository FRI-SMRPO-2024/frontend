<script setup lang="ts">
import { LoginFormData, LoginResponse } from "../types";
import { useField, useForm } from "vee-validate";
import { handleSuccessAuth } from "@/features/auth/api";
import Alert from "@/components/Alert/Alert.vue";
import { useAxios } from "@/composables/useAxios";
import { useRouter } from "vue-router";
import { Loader } from "@/components/Common";

const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    email(value) {
      if (/^[a-z0-9.-]+@[a-z0-9.-]+\.[a-z]+$/i.test(value)) return true;

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

const { execute, isError, error, isLoading } = useAxios<LoginResponse>({
  method: "post",
  url: "auth/login",
});

const router = useRouter();

const submit = handleSubmit((values: LoginFormData) => {
  execute(values)
    .then((res: LoginResponse) => {
      handleSuccessAuth(res);
      router.push({ name: "dashboard" });
    })
    .catch(() => handleReset());
});
</script>

<template>
  <Alert v-if="isError" :message="error.message.message" type="error" class="mb-3" />
  <form fast-fail @submit="submit">
    <v-text-field
      v-model="email.value.value"
      variant="outlined"
      :error-messages="email.errorMessage.value"
      label="Email"
      density="compact"
    ></v-text-field>
    <v-text-field
      v-model="password.value.value"
      :error-messages="password.errorMessage.value"
      label="Password"
      type="password"
      variant="outlined"
      density="compact"
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
  <div v-if="isLoading" class="flex justify-center mt-3">
    <Loader />
  </div>
</template>
