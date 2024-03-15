<template>
  <div class="flex items-center gap-x-3">
    <div class="p-2 w-fit rounded-md bg-gray-900/10">
      <v-icon :icon="icon" />
    </div>

    <div>
      <h2 class="text-xl font-bold text-capitalize">{{ title }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
type HeadingProps = {
  title: string;
  icon: string;
};

defineProps<HeadingProps>();
</script>
