<template>
  <div class="flex flex-col space-y-2">
    <h2 class="text-gray-800 font-semibold flex items-center space-x-4">
      <v-icon :icon="icon" />
      <span>{{ title }}</span>
    </h2>
    <p class="font-light text-gray-500 text-sm mb-2 whitespace-pre-line">
      {{ description }}
    </p>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
type SectionProps = {
  title: string;
  description?: string;
  icon: string;
};

defineProps<SectionProps>();
</script>
