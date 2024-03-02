<script setup lang="ts">
import { RouterView } from "vue-router";
import { LAYOUTS } from "@/config";
import { Authenticated, Default } from "@/components/Layout";
import { useRoute } from "vue-router";

import "@/assets/index.css";

const route = useRoute();
</script>

<template>
  <Authenticated v-if="route.meta.layout == LAYOUTS.AUTHENTICATED">
    <RouterView />
  </Authenticated>
  <Default v-else>
    <RouterView />
  </Default>
</template>
