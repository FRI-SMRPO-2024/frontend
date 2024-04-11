<script setup lang="ts">
import { StoryTask } from "@/features/tasks/types";
import { ref, toRef } from "vue";
import { SelectAssigneForm } from "@/features/tasks";
import { useUserStore } from "@/stores/user.store";
import { useAxios } from "@/composables/useAxios";
import { Alert } from "@/components/Alert";
import { Loader } from "@/components/Common";
import emitter from "@/plugins";
import { EditTimeEstimationForm } from "@/features/tasks/components";

type TaskCardProps = {
  task: StoryTask;
  projectId: number;
};

const props = defineProps<TaskCardProps>();

const selectMenu = ref(false);
const optionsMenu = ref(false);
const timeEstimationMenu = ref(false);
const timeEstimationValue = toRef(props.task.task.time_estimation);

const user = useUserStore().getData();
const emit = defineEmits(["taskUpdated"]);

const constructInitials = (task: StoryTask) => {
  if (!task.assignee) {
    return "N/A";
  }

  return `${task.assignee.first_name.charAt(0).toUpperCase()}${task.assignee.last_name.charAt(0).toUpperCase()}`;
};
console.log(`task/update/${props.task.task.id}`);
const {
  execute: updateTask,
  isLoading,
  isError,
  error,
} = useAxios<StoryTask>({
  method: "put",
  url: `task/update/${props.task.task.id}`,
});

const changeTaskStatus = (status: "ACCEPTED" | "NULL" | "COMPLETED") => {
  const assignee_id = status === "NULL" ? null : props.task.task.assignee_id;
  updateTask(
    {
      status: status === "NULL" ? null : status,
      assignee_id,
    },
    `task/update/${props.task.task.id}`,
  ).then(() => {
    emit("taskUpdated");
  });
};

const updateTaskAssignee = (assignee: { user: string | null }) => {
  const status = assignee.user ? "PENDING" : null;
  updateTask(
    {
      assignee_id: assignee.user,
      status,
    },
    `task/update/${props.task.task.id}`,
  ).then(() => {
    emit("taskUpdated");
  });
};

emitter.on(
  `menuClosePoint${props.task.task.id}`,
  ({ taskId, timeEstimation }: { taskId: number; timeEstimation: number }) => {
    if (taskId !== props.task.task.id) {
      return;
    }

    timeEstimationMenu.value = false;
    timeEstimationValue.value = timeEstimation;
  },
);
</script>

<template>
  <div class="flex justify-between items-center gap-x-2 text-sm">
    <div
      class="grow px-4 py-3 border rounded-md flex justify-between items-center"
      :class="{
        'completed-task': task.task.status === 'COMPLETED',
      }"
    >
      <p class="text-sm grow">{{ task.task.description }}</p>
      <div class="shrink flex justify-end items-center space-x-2">
        <Alert v-if="isError" :message="error.message.error" type="error" />
        <div v-if="isLoading">
          <Loader />
        </div>
        <div
          v-if="task.task.status === 'PENDING' && task.assignee.id !== user?.id"
          class="rounded-md border py-1 px-2 text-xs bg-blue-400 border-blue-600 text-white"
        >
          Pending
        </div>
        <div
          v-if="task.task.status === 'PENDING' && task.assignee.id === user?.id"
          class="rounded-md border cursor-pointer py-1 px-2 text-xs bg-green-400 border-green-600 text-white"
          @click="changeTaskStatus('ACCEPTED')"
        >
          Accept
        </div>
        <div
          v-if="task.task.status === 'PENDING' && task.assignee.id === user?.id"
          class="rounded-md border cursor-pointer py-1 px-2 text-xs bg-red-400 border-red-600 text-white"
          @click="changeTaskStatus('NULL')"
        >
          Reject
        </div>
        <v-menu
          v-model="timeEstimationMenu"
          :close-on-content-click="false"
          location="bottom"
        >
          <template v-slot:activator="{ props }">
            <div
              v-bind="props"
              class="min-w-16 rounded-md border border-gray-500 cursor-pointer py-1 px-2 text-xs text-gray-700 flex items-center justify-between space-x-1"
            >
              <span
                ><v-icon icon="mdi-timer-edit-outline" size="small" />:</span
              >
              <span>{{ timeEstimationValue }}h</span>
            </div>
          </template>
          <v-card min-width="400">
            <v-list>
              <v-list-item
                prepend-icon="mdi-timer-edit-outline"
                subtitle="Estimate task"
              >
              </v-list-item>
              <v-list-item>
                <EditTimeEstimationForm
                  :task-id="task.task.id"
                  :idx="task.task.id"
                  :estimation="task.task.time_estimation"
                  class="mt-2"
                />
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <v-menu
          v-model="optionsMenu"
          :close-on-content-click="true"
          location="bottom"
        >
          <template v-slot:activator="{ props }">
            <div
              v-bind="props"
              class="rounded-md border border-gray-500 cursor-pointer text-xs py-1 px-2"
            >
              <v-icon icon="mdi-dots-horizontal" size="small" />
            </div>
          </template>
          <v-card min-width="300">
            <v-list>
              <v-list density="compact" nav>
                <v-list-item
                  prepend-icon="mdi-pencil-circle-outline"
                  title="Edit Task"
                  value="edit"
                />
                <v-list-item
                  v-if="
                    user?.id === task.task.assignee_id &&
                    task.task.status === 'ACCEPTED'
                  "
                  prepend-icon="mdi-check-underline"
                  title="Complete Task"
                  @click="changeTaskStatus('COMPLETED')"
                  value="complete"
                />
                <v-list-item
                  v-if="
                    user?.id === task.task.assignee_id &&
                    task.task.status === 'COMPLETED'
                  "
                  prepend-icon="mdi-check-underline"
                  title="In Progress"
                  @click="changeTaskStatus('ACCEPTED')"
                  value="inprogress"
                />
                <v-list-item
                  prepend-icon="mdi-timer-sand"
                  title="Log Time"
                  value="logtime"
                />
                <v-list-item
                  prepend-icon="mdi-delete-circle-outline"
                  title="Delete"
                  value="delete"
                />
              </v-list>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </div>
    <v-menu
      v-model="selectMenu"
      :close-on-content-click="false"
      location="bottom"
    >
      <template v-slot:activator="{ props }">
        <div
          v-bind="props"
          class="p-2 rounded-full border border-gray-500 bg-gray-300/10 cursor-pointer min-w-10 text-center text-gray-700"
        >
          {{ constructInitials(task) }}
        </div>
      </template>
      <v-card
        min-width="400"
        v-if="
          (task.assignee?.id === user?.id && task.task.status == 'ACCEPTED') ||
          task.task.status == null
        "
      >
        <v-list>
          <v-list-item prepend-icon="mdi-account" subtitle="Assign a User">
          </v-list-item>
          <v-list-item>
            <SelectAssigneForm
              @selectedUser="updateTaskAssignee"
              :assignedUserId="task.assignee?.id"
              :projectId="projectId"
              class="mt-4"
            />
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>
<style>
.completed-task {
  border-color: rgb(74 222 128) !important;
  background-color: rgb(187 247 208);
}
</style>
