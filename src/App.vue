<script setup lang="ts">
import { RouterView } from "vue-router";
import { LAYOUTS } from "@/config";
import { Authenticated, Default } from "@/components/Layout";

import "@/assets/index.css";
</script>

<template>
  <Authenticated v-if="this.$route.meta.layout == LAYOUTS.AUTHENTICATED">
    <RouterView />
  </Authenticated>
  <Default v-else>
    <RouterView />
  </Default>
</template>
