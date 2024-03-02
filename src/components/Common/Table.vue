<template>
  <v-table height="300px" fixed-header>
    <thead>
      <tr>
        <th class="text-left">#</th>
        <th v-for="(header, idx) in headers" :key="idx">{{ header }}</th>
        <th v-if="displayActions" class="text-left">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, idx) in rows" :key="idx">
        <td>{{ idx + 1 }}</td>
        <td v-for="(item, idx) in row" :key="idx">{{ item }}</td>
        <td v-if="displayActions">
          <v-btn
            color="blue-lighten-2"
            icon="mdi-pencil-circle"
            variant="text"
          ></v-btn>
          <v-btn
            color="red-lighten-2"
            icon="mdi-delete-circle"
            variant="text"
          ></v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { UserRows } from "@/features/users/types";

type TableProps = {
  headers: string[];
  rows: UserRows[];
  displayActions: boolean;
};

defineProps<TableProps>();
</script>
