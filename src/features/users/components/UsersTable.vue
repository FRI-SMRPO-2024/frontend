<template>
  <div class="w-full">
    <Table :headers="headers" :rows="data" :display-actions="true" />
  </div>
</template>
<script setup lang="ts">
import { Table } from "@/components/Common";
import { UserRows } from "../types";

const headers = ["Username", "Full name", "Email", "Role"];
const data: UserRows[] = [
  {
    username: "testuser",
    fullname: "user userson",
    email: "testuser@gmail.com",
    role: "Admin",
  },
  {
    username: "svensvenson",
    fullname: "svens venson",
    email: "svensvenson@gmail.com",
    role: "User",
  },
  {
    username: "martinpozenel",
    fullname: "martinpozenel",
    email: "martinpozenel@gmail.com",
    role: "User",
  },
];
</script>
