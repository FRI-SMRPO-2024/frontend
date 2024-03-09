<script setup lang="ts">
import { CreateUserData } from "../types";
import emitter from "@/plugins";
import { useField, useForm } from "vee-validate";

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
      if (value?.length >= 12) return true;

      return "Password length must be at least 12 chars long!";
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

const submit = handleSubmit((values: CreateUserData) => {
  console.log(values);
  // TODO: Connect to API

  emitter.emit("dialogClose");
});
</script>

<template>
  <form fast-fail @submit.prevent="submit">
    <div class="flex items-center w-full justify-between space-x-4">
      <v-text-field
        v-model="firstName.value.value"
        :error-messages="firstName.errorMessage.value"
        label="First Name"
        variant="outlined"
        class="w-full"
      ></v-text-field>

      <v-text-field
        v-model="lastName.value.value"
        :error-messages="lastName.errorMessage.value"
        label="Last Name"
        variant="outlined"
        class="w-full"
      ></v-text-field>
    </div>
    <v-text-field
      v-model="email.value.value"
      variant="outlined"
      :error-messages="email.errorMessage.value"
      label="Email"
    ></v-text-field>
    <v-text-field
      v-model="username.value.value"
      :error-messages="username.errorMessage.value"
      label="Username"
      variant="outlined"
    ></v-text-field>
    <v-text-field
      v-model="password.value.value"
      :error-messages="password.errorMessage.value"
      label="Password"
      type="password"
      variant="outlined"
    ></v-text-field>
    <v-select
      v-model="role.value.value"
      :error-messages="role.errorMessage.value"
      label="Role"
      variant="outlined"
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
</template>
