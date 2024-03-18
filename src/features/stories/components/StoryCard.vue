<template>
  <div
    v-if="data.status === check"
    class="rounded-md border-gray-100 py-6 px-4 border w-full transition duration-300 ease-in-out hover:shadow-md"
  >
    <div class="flex justify-start">
      <div class="flex flex-column w-full justify-center">
        <div class="grow">
          <div class="w-full flex-none flex justify-between items-center">
            <div class="shrink text-md text-gray-700 font-medium leading-none">
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
                class="flex align-center justify-start space-x-1 text-xs cursor-pointer"
              >
                <v-menu
                  v-model="menu_point_estimation"
                  :close-on-content-click="false"
                  location="end"
                >
                  <template v-slot:activator="{ props }">
                    <span v-bind="props"
                      ><v-icon icon="mdi-timer-edit-outline" size="small" />
                      Pont Estimation:</span
                    >
                    <span>{{ pointEstimationVal ?? 0 }}</span>
                  </template>
                  <v-card min-width="400" v-if="data.status === 'PRODUCT'">
                    <v-list>
                      <v-list-item
                        prepend-icon="mdi-timer-edit-outline"
                        subtitle="Point estimate story"
                      >
                      </v-list-item>
                      <v-list-item>
                        <PointEstimationForm
                          :storyId="data.id"
                          :estimation="pointEstimationVal"
                          :idx="idx"
                          class="mt-2"
                        />
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-menu>
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
            </div>
          </div>
        </div>
        <div
          v-if="idx === clickedTicket"
          class="mt-6 flex flex-col space-y-6 w-full"
        >
          <v-divider class="w-100 border-gray-500"></v-divider>
          <div class="flex-col justify-start space-y-2">
            <Section
              title="Story Description"
              icon="mdi-information"
              class="shrink"
              :description="data.description"
            >
            </Section>
          </div>
          <div class="flex-col justify-start space-y-2">
            <Section
              title="Acceptance Criteria"
              icon="mdi-check-circle"
              class="shrink"
              :description="data.acceptance_criteria"
            >
            </Section>
          </div>
          <div class="w-full flex justify-end" v-if="data.status === 'PRODUCT'">
            <v-btn
              prepend-icon="mdi-plus-circle"
              variant="flat"
              color="#5865f2"
              class="h-full"
              @click="addStoryToSprint"
            >
              Add to current sprint
            </v-btn>
          </div>
          <v-divider class="w-4/6 mx-auto border-gray-500"></v-divider>
          <StoryTasks :storyId="data.id" :projectId="projectId" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  Story,
  PointEstimationForm,
} from "@/features/stories";
import { onBeforeMount, ref, toRef } from "vue";
import emitter from "@/plugins";
import { StoryTasks } from "@/features/tasks";
import { Section } from "@/components/Common";
import { useAxios } from "@/composables/useAxios";
import { useToast } from "vue-toast-notification";

const emit = defineEmits(["get-stories"]);

type StoryCardProps = {
  data: Story;
  projectId: number;
  clickedTicket: number;
  idx: number;
  check: string;
};

const propsGotten = defineProps<StoryCardProps>();
const currentSprint = ref<object>({});

const menu_point_estimation = ref(false);
const pointEstimationVal = toRef<number>(
  propsGotten.data.point_estimation ?? 0,
);

const addStoryToSprint = () => {
  if (propsGotten.data.point_estimation < 1) {
    useToast().error("Point estimation has to be set!", {
      position: "top",
    });
    return;
  }
  const { execute: updateStory } = useAxios({
    method: "put",
    url: `story/update/${propsGotten.data.id}`,
  });

  updateStory({
    sprint_id: currentSprint.value.id,
    status: "SPRINT",
  }).then(() => {
    useToast().success("Successfully added story to current sprint!", {
      position: "top",
    });
    emit("get-stories");
  });
};

const triggerGetCurrentSprint = async () => {
  const { execute: getCurrentSprint } = useAxios({
    method: "get",
    url: `sprint/current/${propsGotten.projectId}`,
  });

  await getCurrentSprint().then((returned: object) => {
    currentSprint.value = returned;
  });
};

emitter.on(
  `menuClosePoint${propsGotten.idx}`,
  ({
    storyId,
    pointEstimation,
  }: {
    storyId: number;
    pointEstimation: number;
  }) => {
    if (storyId !== propsGotten.data.id) {
      return;
    }

    menu_point_estimation.value = false;
    pointEstimationVal.value = pointEstimation;
  },
);

onBeforeMount(() => {
  triggerGetCurrentSprint();
});
</script>
