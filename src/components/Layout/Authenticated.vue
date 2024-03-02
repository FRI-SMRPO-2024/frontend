<template>
  <v-layout class="rounded rounded-md flex justify-start">
    <Sidebar />
    <div class="flex flex-col justify-start w-full h-screen">
      <div class="shrink">
        <AppBar />
      </div>
      <v-main class="w-full grow">
        <div class="py-5 px-3 w-full h-full">
          <slot></slot>
        </div>
      </v-main>
    </div>
  </v-layout>
</template>
<script setup lang="ts">
import { AppBar, Sidebar } from "@/components/Navigation";
</script>
