<template>
  <div
    class="rounded-md border-gray-100 py-6 px-4 border w-full transition duration-300 ease-in-out hover:shadow-md"
  >
    <div class="flex justify-start">
      <div class="flex flex-column w-full justify-center">
        <div class="grow">
          <div class="w-full flex-none flex justify-between items-center">
            <div
              class="shrink text-lg text-gray-700 font-semibold leading-none"
            >
              {{ data.name }}
            </div>
            <div
              class="grow text-gray-500 flex items-center justify-end space-x-6"
            >
              <v-tooltip :text="data.priority">
                <template v-slot:activator="{ props }">
                  <div
                    v-bind="props"
                    class="flex align-center justify-start space-x-1 text-xs"
                  >
                    <span
                      ><v-icon icon="mdi-chevron-triple-up" size="small" />
                      Priority:</span
                    >
                    <v-icon
                      v-if="data.priority === 'NULL'"
                      size="18"
                      icon="mdi-flag-triangle"
                    ></v-icon>
                    <v-icon
                      v-if="data.priority === 'MUST_HAVE'"
                      size="18"
                      icon="mdi-triangle"
                      color="orange"
                    ></v-icon>
                    <v-icon
                      v-if="data.priority === 'SHOULD_HAVE'"
                      size="18"
                      icon="mdi-triangle-outline"
                    ></v-icon>
                    <v-icon
                      v-if="data.priority === 'COULD_HAVE'"
                      size="18"
                      icon="mdi-triangle"
                      color="blue"
                    ></v-icon>
                    <v-icon
                      v-if="data.priority === 'WONT_HAVE_THIS_TIME'"
                      size="18"
                      icon="mdi-flash-triangle"
                    ></v-icon>
                  </div>
                </template>
              </v-tooltip>
              <div
                v-if="data.point_estimation > 0"
                class="flex align-center justify-start space-x-1 text-xs"
              >
                <span
                  ><v-icon
                    icon="mdi-numeric-3-box-multiple-outline"
                    size="small"
                  />
                  Point Estimation:</span
                >
                <span>{{ data.point_estimation }}</span>
              </div>
              <div
                v-if="data.business_value"
                class="flex align-center justify-start space-x-1 text-xs"
              >
                <span
                  ><v-icon
                    icon="mdi-chart-bell-curve-cumulative"
                    size="small"
                  />
                  Business Value:</span
                >
                <span>{{ data.business_value }}</span>
              </div>
              <div
                class="flex align-center justify-start space-x-1 text-xs cursor-pointer"
              >
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  location="end"
                >
                  <template v-slot:activator="{ props }">
                    <span v-bind="props"
                      ><v-icon icon="mdi-timer-edit-outline" size="small" />
                      Time Estimation:</span
                    >
                    <span>{{ timeEstimationVal ?? 0 }}</span>
                  </template>
                  <v-card min-width="400">
                    <v-list>
                      <v-list-item
                        prepend-icon="mdi-timer-edit-outline"
                        subtitle="Estimate story"
                      >
                      </v-list-item>
                      <v-list-item>
                        <TimeEstimationForm
                          :storyId="data.id"
                          :estimation="timeEstimationVal"
                          class="mt-2"
                        />
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-menu>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="idx === clickedTicket"
          class="mt-6 flex flex-col space-y-4 w-full"
        >
          <div class="flex-col justify-start space-y-2">
            <Section
              title="Story Description"
              icon="mdi-information"
              class="shrink"
            >
              <div class="px-4" style="white-space: pre-line">
                {{ data.description }}
              </div>
            </Section>
          </div>
          <div class="flex-col justify-start space-y-2">
            <Section
              title="Acceptance Criteria"
              icon="mdi-check-circle"
              class="shrink"
            >
              <div class="px-4" style="white-space: pre-line">
                {{ data.acceptance_criteria }}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Story, TimeEstimationForm } from "@/features/projects";
import { ref, toRef } from "vue";
import emitter from "@/plugins";

type StoryCardProps = {
  data: Story;
  clickedTicket: number;
  idx: number;
};

const props = defineProps<StoryCardProps>();

const menu = ref(false);
const timeEstimationVal = toRef<number>(props.data.timeEstimation ?? 0);

emitter.on(
  "menuClose",
  ({
    storyId,
    timeEstimation,
  }: {
    storyId: number;
    timeEstimation: number;
  }) => {
    if (storyId !== props.data.id) {
      return;
    }

    menu.value = false;
    timeEstimationVal.value = timeEstimation;
  },
);
</script>
