<template>
  Project View page
  <v-btn @click="handleBack"> Back </v-btn>
</template>

<script setup lang="ts">
  import { useRouter } from "vue-router";

  const router = useRouter();

  const handleBack = () => router.back();
</script>
