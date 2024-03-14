<template>
  <div class="rounded-md bg-blue-lighten-4 rounded-3xl p-4 w-full transition duration-300 ease-in-out hover:shadow-md">

    <div class="flex justify-space-between">
      <div>
        <b style="font-size: 18px"> <v-icon class="mr-4">mdi-fast-forward</v-icon>Sprint {{idx+1}}</b>
      </div>
     <div>
       Velocity: <b>{{data.velocity}}</b>
     </div>
    </div>
    <div class="flex justify-space-between">
      <p>Start date: <b>{{data.start_date.getDate()}}.{{data.start_date.getMonth()+1}}.{{data.start_date.getFullYear()}} {{data.start_date.toLocaleDateString(locale, { weekday: 'long' })}}</b></p>
      <p>End date: <b>{{data.end_date.getDate()}}.{{data.end_date.getMonth()+1}}.{{data.end_date.getFullYear()}} {{data.end_date.toLocaleDateString(locale, { weekday: 'long' })}}</b></p>
    </div>


  </div>
</template>
<script setup lang="ts">
import { Sprint } from "@/features/projects";

type StoryCardProps = {
  data: Sprint;
  idx: number;
};

defineProps<StoryCardProps>();
</script>
