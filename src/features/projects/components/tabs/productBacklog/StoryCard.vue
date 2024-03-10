<template>
  <div
    class="rounded-md border-gray-100 border p-2 rounded-3xl p-4 w-full transition duration-300 ease-in-out hover:shadow-md"
  >
    <div class="flex justify-start space-x-4">
      <div class="flex flex-column w-full">
        <div class="grow">
          <div
            class="w-full flex-none text-lg text-gray-800 font-bold leading-none"
          >
            {{ data.name }}
          </div>
          <div class="flex-auto text-gray-500 my-1">
            {{ data.description }}
          </div>
          <div class="flex text-gray-500 my-1 justify-space-between">
            <div>Priority: {{ data.priority }}</div>
            <div>Business value: {{ data.businessValue }}</div>
          </div>
          <div class="flex text-gray-500 my-1 justify-space-between">
            <div>Status: {{ data.status }}</div>
            <div>Point estimation: {{ data.pointEstimation }}</div>
          </div>
          <div class="font-weight-bold mt-4">Acceptance criteria:</div>

          <div class="flex-auto text-gray-500 ml-3">
            {{ data.acceptanceCriteria }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Story } from "@/features/projects";

type StoryCardProps = {
  data: Story;
};

defineProps<StoryCardProps>();
</script>
