<script setup lang="ts">
import { RouterView } from "vue-router";
import { LAYOUTS } from "@/config";
import { Authenticated, Default } from "@/components/Layout";
import { useRoute } from "vue-router";

import "@/assets/index.css";
import { AppProvider } from "@/providers";

const route = useRoute();
</script>

<template>
  <AppProvider>
    <Authenticated v-if="route.meta.layout == LAYOUTS.AUTHENTICATED">
      <RouterView />
    </Authenticated>
    <Default v-else>
      <RouterView />
    </Default>
  </AppProvider>
</template>
