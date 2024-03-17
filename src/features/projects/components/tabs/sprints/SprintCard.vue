<template>
  <div
    class="rounded-md bg-blue-lighten-4 rounded-3xl p-4 w-full transition duration-300 ease-in-out hover:shadow-md"
  >
    <div class="flex justify-space-between">
      <div>
        <b style="font-size: 18px">
          <v-icon class="mr-4">mdi-fast-forward</v-icon>Sprint {{ idx + 1 }}</b
        >
      </div>
      <div>
        Velocity: <b>{{ data.velocity }}</b>
      </div>
    </div>
    <div class="flex justify-space-between">
      <p>
        Start date:
        <b
          >{{ new Date(data.start_date).getDate() }}.{{
            new Date(data.start_date).getMonth() + 1
          }}.{{ new Date(data.start_date).getFullYear() }}
          {{
            new Date(data.start_date).toLocaleDateString(locale, {
              weekday: "long",
            })
          }}</b
        >
      </p>
      <p>
        End date:
        <b
          >{{ new Date(data.end_date).getDate() }}.{{
            new Date(data.end_date).getMonth() + 1
          }}.{{ new Date(data.end_date).getFullYear() }}
          {{
            new Date(data.end_date).toLocaleDateString(locale, {
              weekday: "long",
            })
          }}</b
        >
      </p>
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
