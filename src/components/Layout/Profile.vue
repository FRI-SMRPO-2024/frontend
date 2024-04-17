<template>
  <UpdateForm
    :usernameProp="user.username"
    :firstNameProp="user.first_name"
    :lastNameProp="user.last_name"
    :emailProp="user.email"
    :roleProp="user.is_admin ? 'Admin' : 'User'"
    :isProfileChange="true"
  ></UpdateForm>
</template>
<script setup lang="ts">
import { useUserStore } from "@/stores/user.store";
import UpdateForm from "@/features/users/components/UpdateForm.vue";

const userStore = useUserStore();

const user = userStore.getData();
console.log(user);
</script>
