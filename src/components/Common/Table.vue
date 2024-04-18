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
      <td
        v-if="displayActions"
        class="flex items-center flex-start space-x-1"
      >
        <v-btn
          color="blue-lighten-2"
          icon="mdi-pencil-circle"
          variant="text"
          size="sm"
        ></v-btn>
        <v-btn
          color="red-lighten-2"
          icon="mdi-delete-circle"
          variant="text"
          size="sm"
        ></v-btn>
      </td>
    </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
type TableProps = {
  headers: string[];
  rows: object[];
  displayActions: boolean;
};

defineProps<TableProps>();
</script>
