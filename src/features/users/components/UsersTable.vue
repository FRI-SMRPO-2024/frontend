<template>
  <div class="w-full">
    <Table :headers="headers" :rows="data" :display-actions="true" />
  </div>
</template>
<script setup lang="ts">
import { Table } from "@/components/Common";
import { usersData } from "@/features/users";

const headers = ["Username", "Full name", "Email", "Role"];
const data = usersData;
</script>
