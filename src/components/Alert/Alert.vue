<template>
  <v-alert :type="type">
    <template #title v-if="title">
      <div class="text-md">{{ title }}</div>
    </template>
    <template #text>
      <div class="text-sm">{{ message }}</div>
    </template>
  </v-alert>
</template>

<script setup lang="ts">
type AlertProps = {
  title?: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
};

defineProps<AlertProps>();
</script>
