<template>
  <div className="flex items-center gap-x-3">
    <div class="p-2 w-fit rounded-md bg-gray-900/10">
      <v-icon :icon="icon" />
    </div>

    <div>
      <h2 className="text-xl font-bold text-capitalize">{{ title }}</h2>
      <p className="text-sm text-gray-500">
        <v-breadcrumbs :items="getBreadcrumbs" class="p-0"></v-breadcrumbs>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

type HeadingProps = {
  title: string;
  icon: string;
};

defineProps<HeadingProps>();

const getBreadcrumbs = computed(() => {
  return route.fullPath
    .substring(1)
    .split("/")
    .map((item: string) => item.charAt(0).toUpperCase() + item.slice(1));
});
</script>
