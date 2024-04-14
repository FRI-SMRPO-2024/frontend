<template>
  <div
    v-if="storyData.status === check"
    class="rounded-md border-gray-100 py-6 px-4 border w-full transition duration-300 ease-in-out hover:shadow-md mt-2"
  >
    <div class="flex justify-start">
      <div class="flex flex-column w-full justify-center">
        <div class="grow">
          <div class="w-full flex-none flex justify-between items-center">
            <div class="shrink text-md text-gray-700 font-medium leading-none">
              {{ storyData.name }}
            </div>
            <div
              class="grow text-gray-500 flex items-center justify-end space-x-6"
            >
              <v-tooltip :text="storyData.priority">
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
                      v-if="storyData.priority === 'NULL'"
                      size="18"
                      icon="mdi-flag-triangle"
                    ></v-icon>
                    <v-icon
                      v-if="storyData.priority === 'MUST_HAVE'"
                      size="18"
                      icon="mdi-triangle"
                      color="orange"
                    ></v-icon>
                    <v-icon
                      v-if="storyData.priority === 'SHOULD_HAVE'"
                      size="18"
                      icon="mdi-triangle-outline"
                    ></v-icon>
                    <v-icon
                      v-if="storyData.priority === 'COULD_HAVE'"
                      size="18"
                      icon="mdi-triangle"
                      color="blue"
                    ></v-icon>
                    <v-icon
                      v-if="storyData.priority === 'WONT_HAVE_THIS_TIME'"
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
                  <v-card
                    min-width="400"
                    v-if="
                      storyData.status === 'PRODUCT' &&
                      useUserStore().getRole().includes('SCRUM_MASTER')
                    "
                  >
                    <v-list>
                      <v-list-item
                        prepend-icon="mdi-timer-edit-outline"
                        subtitle="Point estimate story"
                      >
                      </v-list-item>
                      <v-list-item>
                        <PointEstimationForm
                          :storyId="storyData.id"
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
                v-if="storyData.business_value"
                class="flex align-center justify-start space-x-1 text-xs"
              >
                <span
                  ><v-icon
                    icon="mdi-chart-bell-curve-cumulative"
                    size="small"
                  />
                  Business Value:
                </span>
                <span>{{ storyData.business_value }}</span>
              </div>
              <div
                v-if="
                  (useUserStore().getRole().includes('OWNER') ||
                    useUserStore().getRole().includes('SCRUM_MASTER')) &&
                  storyData.status === 'PRODUCT'
                "
                class="flex align-center justify-start space-x-1 text-xs cursor-pointer"
              >
                <v-menu
                  v-model="optionsMenu"
                  :close-on-content-click="true"
                  location="bottom"
                >
                  <template v-slot:activator="{ props }">
                    <div v-bind="props" class="cursor-pointer text-xs">
                      <v-icon icon="mdi-dots-horizontal" size="small" />
                    </div>
                  </template>
                  <v-card min-width="250">
                    <v-list>
                      <v-list density="compact" nav>
                        <v-list-item
                          prepend-icon="mdi-pencil-circle-outline"
                          title="Edit Story"
                          @click="editDialog = true"
                          value="edit"
                        />
                        <v-list-item
                          prepend-icon="mdi-delete-circle-outline"
                          title="Delete Story"
                          value="delete"
                          @click="deleteUserStory()"
                        />
                      </v-list>
                    </v-list>
                  </v-card>
                </v-menu>
                <Dialog
                  title="Edit a story"
                  :show-dialog="editDialog"
                  :display-action-btn="false"
                  :dialog-width="600"
                  @close-dialog="editDialog = false"
                  @click:outside="editDialog = false"
                >
                  <EditStoryForm
                    :story="storyData"
                    @update-story="updateStoryData"
                  />
                </Dialog>
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
              :description="storyData.description"
            >
            </Section>
          </div>
          <div class="flex-col justify-start space-y-2">
            <Section
              title="Acceptance Criteria"
              icon="mdi-check-circle"
              class="shrink"
              :description="storyData.acceptance_criteria"
            >
            </Section>
          </div>
          <div
            class="w-full flex justify-end"
            v-if="
              storyData.status === 'PRODUCT' &&
              useUserStore().getRole().includes('SCRUM_MASTER') &&
              pointEstimationVal > 0
            "
          >
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
          <StoryTasks
            :storyStatus="storyData.status"
            :storyId="storyData.id"
            :projectId="projectId"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Story, PointEstimationForm, EditStoryForm } from "@/features/stories";
import { ref, toRef } from "vue";
import emitter from "@/plugins";
import { StoryTasks } from "@/features/tasks";
import { Dialog, Section } from "@/components/Common";
import { useAxios } from "@/composables/useAxios";
import { useToast } from "vue-toast-notification";
import { useUserStore } from "@/stores/user.store";

const emit = defineEmits(["get-stories", "deleteStory"]);

type StoryCardProps = {
  data: Story;
  projectId: number;
  clickedTicket: number;
  idx: number;
  check: string;
  currentSprint: object;
};

const propsGotten = defineProps<StoryCardProps>();
const optionsMenu = ref(false);
const editDialog = ref(false);
const storyData = toRef<Story>(propsGotten.data);

const menu_point_estimation = ref(false);
const pointEstimationVal = toRef<number>(storyData.value.point_estimation ?? 0);

const { execute: deleteStory } = useAxios<Story>({
  method: "delete",
  url: `story/delete/${storyData.value.id}`,
});

const addStoryToSprint = () => {
  if (Object.keys(propsGotten.currentSprint).length === 0) {
    useToast().error("There is no current assigned sprint!", {
      position: "top",
    });
    return;
  }
  if (pointEstimationVal.value < 1) {
    useToast().error("Point estimation has to be set!", {
      position: "top",
    });
    return;
  }
  const { execute: updateStory } = useAxios({
    method: "put",
    url: `story/update/${storyData.value.id}`,
  });

  updateStory({
    sprint_id: propsGotten.currentSprint.id,
    status: "SPRINT",
  }).then(() => {
    useToast().success("Successfully added story to current sprint!", {
      position: "top",
    });
    emit("get-stories");
  });
};

const deleteUserStory = () => {
  deleteStory().then(() => {
    useToast().success("Deleted a story", { position: "top" });
    emit("deleteStory", storyData.value.id);
  });
};

const updateStoryData = (newStoryData: Story) => {
  storyData.value = newStoryData;
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
    if (storyId !== storyData.value.id) {
      return;
    }

    menu_point_estimation.value = false;
    pointEstimationVal.value = pointEstimation;
  },
);
</script>
