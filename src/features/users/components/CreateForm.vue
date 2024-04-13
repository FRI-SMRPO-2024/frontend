<script setup lang="ts">
import { CreateUserData } from "../types";
import emitter from "@/plugins";
import { useField, useForm } from "vee-validate";
import { ref } from "vue";
import { useAxios } from "@/composables/useAxios";
import { AuthUser } from "@/features/auth";
import { Loader } from "@/components/Common";
import { Alert } from "@/components/Alert";
import { useToast } from "vue-toast-notification";
import PasswordMeter from "vue-simple-password-meter";

const { handleSubmit } = useForm({
  validationSchema: {
    username(value) {
      if (value) return true;

      return "Username is required!";
    },
    firstName(value) {
      if (value) return true;

      return "First name is required!";
    },
    lastName(value) {
      if (value) return true;

      return "Last name is required!";
    },
    email(value) {
      if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true;

      return "Must be a valid e-mail.";
    },
    password(value) {
      if (
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{12,}$/i.test(value)
      )
        return true;

      return "Password must be at least 12 characters long and must contain a number and symbol!";
    },
    role(value) {
      if (value) return true;

      return "Role is required!";
    },
  },
});

const username = useField("username");
const firstName = useField("firstName");
const lastName = useField("lastName");
const email = useField("email");
const password = useField("password");
const role = useField("role");

const { execute, isLoading, error, isError } = useAxios<AuthUser>({
  method: "post",
  url: "auth/signup",
});

const submit = handleSubmit((values: CreateUserData) => {
  execute({
    email: values.email,
    password: values.password,
    first_name: values.firstName,
    last_name: values.lastName,
    username: values.username,
    is_admin: values.role === "Admin",
  }).then((user: AuthUser) => {
    useToast().success(`User ${user.username} successfully created!`, {
      position: "top",
    });
    emitter.emit("dialogClose");
  });
});

const hidePassword = ref<boolean>(true);
</script>

<template>
  <Alert
    v-if="isError"
    :message="error.message.error"
    type="error"
    class="mb-5"
  />
  <form fast-fail @submit.prevent="submit">
    <div class="flex items-center w-full justify-between space-x-2">
      <v-text-field
        v-model="firstName.value.value"
        :error-messages="firstName.errorMessage.value"
        label="First Name"
        density="compact"
        variant="outlined"
        class="w-full"
      ></v-text-field>
      <v-text-field
        v-model="lastName.value.value"
        :error-messages="lastName.errorMessage.value"
        label="Last Name"
        density="compact"
        variant="outlined"
        class="w-full"
      ></v-text-field>
    </div>
    <v-text-field
      v-model="email.value.value"
      variant="outlined"
      density="compact"
      :error-messages="email.errorMessage.value"
      label="Email"
    ></v-text-field>
    <v-text-field
      v-model="username.value.value"
      :error-messages="username.errorMessage.value"
      label="Username"
      density="compact"
      variant="outlined"
    ></v-text-field>
    <v-text-field
      class="mb-0"
      v-model="password.value.value"
      :error-messages="password.errorMessage.value"
      label="Password"
      :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="() => (hidePassword = !hidePassword)"
      :type="hidePassword ? 'password' : 'text'"
      variant="outlined"
      density="compact"
    ></v-text-field>
    <div class="bg-slate-100 rounded-md">
      <password-meter :password="password.value.value" class="mb-5" />
    </div>
    <v-select
      v-model="role.value.value"
      :error-messages="role.errorMessage.value"
      label="Role"
      variant="outlined"
      density="compact"
      :items="['User', 'Admin']"
    ></v-select>
    <div class="w-full flex justify-end">
      <v-btn
        class="w-2/5"
        type="submit"
        prepend-icon="mdi-plus-circle"
        variant="flat"
        color="#5865f2"
      >
        Create User
      </v-btn>
    </div>
  </form>
  <div v-if="isLoading" class="mt-2 flex justify-center">
    <Loader />
  </div>
</template>
