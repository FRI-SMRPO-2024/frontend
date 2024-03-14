<template>
  <div class="rounded-md border-gray-500 border-opacity-50 border p-2 rounded-3xl p-4 w-full transition duration-300 ease-in-out hover:shadow-md">
    <div class="flex justify-start space-x-4">
      <div class="flex flex-column w-full">
        <div class="grow">
          <div
            class="w-full flex-none text-lg text-gray-800 mb-3 font-bold leading-none"
          >
            {{ data.name }}
          </div>
          <div class="flex text-gray-500 my-1 ma-2 justify-space-between">
            <div>
              <b>Priority: </b>
              <v-icon v-if="data.priority === 'NULL'" size="18" icon="mdi-flag-triangle" ></v-icon>
              <span v-if="data.priority === 'NULL'"> No priority set!</span>

              <v-icon v-if="data.priority === 'MUST_HAVE'" size="18" icon="mdi-triangle" color="orange"></v-icon>
              <span v-if="data.priority === 'MUST_HAVE' && idx === clickedTicket"> MUST HAVE</span>

              <v-icon v-if="data.priority === 'SHOULD_HAVE'" size="18" icon="mdi-triangle-outline"></v-icon>
              <span v-if="data.priority === 'SHOULD_HAVE' && idx === clickedTicket"> SHOULD HAVE</span>

              <v-icon v-if="data.priority === 'COULD_HAVE'" size="18" icon="mdi-triangle" color="blue" ></v-icon>
              <span v-if="data.priority === 'COULD_HAVE' && idx === clickedTicket"> COULD HAVE</span>

              <v-icon v-if="data.priority === 'WONT_HAVE_THIS_TIME'" size="18" icon="mdi-flash-triangle"></v-icon>
              <span v-if="data.priority === 'WONT_HAVE_THIS_TIME' && idx === clickedTicket"> WONT HAVE THIS TIME</span>
            </div>
            <div v-if="idx === clickedTicket">Business value: <b>{{ data.businessValue }}</b></div>
            <div v-if="data.pointEstimation > 0">Point estimation: <b>{{ data.pointEstimation }}</b></div>


          </div>
          <div v-if="idx === clickedTicket" class="flex-auto text-gray-500 my-1 border border-opacity-25 rounded pa-2 my-2">
            <b>Description:</b><br>
            <div>

            </div>
            {{ data.description }}
          </div>

          <div v-if="idx === clickedTicket" class="flex-auto w-auto text-gray-500 my-1 border border-opacity-25 rounded pa-2 my-2">
            <b>Acceptance criteria:</b><br>
            <div>
            {{ data.acceptanceCriteria }}
            </div>
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
  clickedTicket: number;
  idx: number;
};

defineProps<StoryCardProps>();
</script>
