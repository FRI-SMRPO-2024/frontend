<template>
  <div class="w-full h-full">
    <Alert v-if="isError" :message="error.message" type="error" />
    <Table
      v-if="!isLoading"
      :headers="headers"
      :rows="usersData"
      :display-actions="true"
      class="h-full"
    />
    <div v-else class="flex justify-center">
      <Loader />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Loader, Table } from "@/components/Common";
import { TableUser, User } from "@/features/users";
import { useAxios } from "@/composables/useAxios";
import { Alert } from "@/components/Alert";
import { onMounted, ref } from "vue";
import { formattedDate } from "@/utils/date";
import emitter from "@/plugins";

const { execute, isLoading, isError, error } = useAxios<User[]>({
  method: "get",
  url: "user/get-all",
});
const usersData = ref<TableUser[]>([]);

const mapUserData = (users: User[]): TableUser[] => {
  return users.map((user: User) => ({
    email: user.email,
    username: user.username ?? "/",
    fullName: `${user.first_name} ${user.last_name}` ?? "/",
    role: user.is_admin ? "Admin" : "User",
    createdOn: formattedDate(user.created_at),
  }));
};

const fetchUserData = (): void => {
  execute().then((users: User[]) => {
    usersData.value = mapUserData(users);
  });
};

emitter.on("dialogClose", () => {
  fetchUserData();
});

const headers = ["Email", "Username", "Full Name", "Role", "Created at"];

onMounted(() => {
  fetchUserData();
});
</script>
