<script setup lang="ts">
import { UpdateUserData } from "../types";
import emitter from "@/plugins";
import { useField, useForm } from "vee-validate";
import { ref } from "vue";
import { useAxios } from "@/composables/useAxios";
import { Loader } from "@/components/Common";
import { Alert } from "@/components/Alert";
import { useToast } from "vue-toast-notification";
import PasswordMeter from "vue-simple-password-meter";
import { handleLogout } from "@/features/auth/api";
import { useRouter } from "vue-router";

const router = useRouter();

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
      if (!value) return true;

      if (
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{12,}$/i.test(value)
      )
        return true;

      return "Password must be at least 12 characters long and must contain a number and symbol!";
    },
    confirmPassword(value) {
      if (!value) return true;

      if (value === password.value.value) return true;

      return "Confirm password must match original password!";
    },
    role(value) {
      if (value) return true;

      return "Role is required!";
    },
  },
});

type userProps = {
  usernameProp: string;
  firstNameProp: string;
  lastNameProp: string;
  emailProp: string;
  roleProp: string;
  isProfileChange: boolean;
};

const props = defineProps<userProps>();

console.log(props);

const username = useField("username");
const firstName = useField("firstName");
const lastName = useField("lastName");
const email = useField("email");
const password = useField("password");
const confirmPassword = useField("confirmPassword");
const role = useField("role");

if (props.usernameProp) username.value.value = props.usernameProp;
if (props.firstNameProp) firstName.value.value = props.firstNameProp;
if (props.lastNameProp) lastName.value.value = props.lastNameProp;
if (props.emailProp) email.value.value = props.emailProp;
if (props.roleProp) role.value.value = props.roleProp;

const { execute: executeId, isError: isErrorId } = useAxios({
  method: "post",
  url: "user/get",
});

let isError = ref(false);
let error = ref(undefined);

const submit = handleSubmit(async (values: UpdateUserData) => {
  try {
    const responseId = await executeId({
      email: props.emailProp,
    });
    console.log("GER IDDDDD");
    console.log(props.emailProp);
    console.log(responseId);

    const { execute: executeUpdate, isError: isErrorUpdate } = useAxios({
      method: "put",
      url: "user/update/" + responseId.id,
    });

    const responseUpdate = await executeUpdate({
      username: values.username,
      first_name: values.firstName,
      last_name: values.lastName,
    });
    console.log(responseUpdate);

    const { execute: executeSetRole, isError: isErrorSetRole } = useAxios({
      method: "put",
      url: "user/set-role/" + responseId.id,
    });

    const responseSetRole = await executeSetRole({
      is_admin: values.role === "Admin",
    });
    console.log(responseSetRole);

    const { execute: executeChangePassword, isError: isErrorChangePassword } =
      useAxios({
        method: "post",
        url: "auth/change-password/" + responseId.id,
      });

    if (values.password) {
      const responseChangePassword = await executeChangePassword({
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      console.log(responseChangePassword);
    }

    const { execute: executeChangeEmail, isError: isErrorChangeEmail } =
      useAxios({
        method: "post",
        url: "auth/change-email/",
      });

    if (values.email !== props.emailProp) {
      console.log("CHANGE EMAIL");
      console.log(responseId.id);
      const responseChangeEmail = await executeChangeEmail({
        new_email: values.email,
        id: responseId.id,
      });
      console.log(responseChangeEmail);
    }
    console.log(values.email);
    console.log(props.emailProp);

    console.log(
      isErrorId.value,
      isErrorUpdate.value,
      isErrorSetRole.value,
      isErrorChangePassword.value,
      isErrorChangeEmail.value,
    );
    if (
      !isErrorId.value &&
      !isErrorUpdate.value &&
      !isErrorSetRole.value &&
      !isErrorChangePassword.value &&
      !isErrorChangeEmail.value
    ) {
      useToast().success(`User successfully updated!`, {
        position: "top",
      });
      emitter.emit("dialogClose");
      if (props.isProfileChange) {
        handleLogout();
        router.push({ name: "login" });
      }
    } else {
      useToast().error(`Error while updating user!`, {
        position: "top",
      });
      emitter.emit("dialogClose");
    }
  } catch (err) {
    isError.value = true;
    if (
      err.message.error ===
      'duplicate key value violates unique constraint "users_data_username_key"'
    ) {
      err.message.error = "User with this username already exists!";
    }
    error.value = err;
  }
});

const hidePassword = ref<boolean>(true);
</script>

<template>
  {{ user }}
  <Alert
    v-if="isError"
    :message="error?.message.error"
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
    <v-text-field
      class="mb-0"
      v-model="confirmPassword.value.value"
      :error-messages="confirmPassword.errorMessage.value"
      label="Confirm Password"
      :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="() => (hidePassword = !hidePassword)"
      :type="hidePassword ? 'password' : 'text'"
      variant="outlined"
      density="compact"
    ></v-text-field>
    <v-select
      v-model="role.value.value"
      :error-messages="role.errorMessage.value"
      label="Role"
      variant="outlined"
      density="compact"
      :disabled="props.isProfileChange"
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
        Update User
      </v-btn>
    </div>
  </form>
  <div v-if="isLoading" class="mt-2 flex justify-center">
    <Loader />
  </div>
</template>
