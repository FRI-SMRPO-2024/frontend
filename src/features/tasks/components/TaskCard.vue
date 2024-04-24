<script setup lang="ts">
import {
  StoryTask,
  TimeLog,
  TimeLogCreate,
  TimeLogUpdate,
} from "@/features/tasks/types";
import { ref, toRef } from "vue";
import { EditTaskForm, SelectAssigneForm } from "@/features/tasks";
import { useUserStore } from "@/stores/user.store";
import { useAxios } from "@/composables/useAxios";
import { Alert } from "@/components/Alert";
import { Loader } from "@/components/Common";
import emitter from "@/plugins";
import { EditTimeEstimationForm } from "@/features/tasks/components";
import { TimeLogsForm } from "@/features/tasks/components";
import { useToast } from "vue-toast-notification";
import { computed } from "vue";
import { onMounted } from "vue";
import { onUnmounted } from "vue";

type TaskCardProps = {
  task: StoryTask;
  projectId: number;
};

const props = defineProps<TaskCardProps>();

const selectMenu = ref(false);
const optionsMenu = ref(false);
const timeEstimationMenu = ref(false);
const taskDescription = toRef(props.task.task.description);
const editMode = ref(false);
const timeEstimationValue = toRef(props.task.task.time_estimation);

const logTimeMenu = ref(false);

const timeLogs = toRef(props.task.time_logs);
const logTimeCombinedValue = computed(() => {
  const totalHours = timeLogs.value.reduce((acc, log) => {
    const dateTimeFrom = new Date(`${log.date}T${log.time_from}`);
    const dateTimeTo = new Date(`${log.date}T${log.time_to}`);
    return (
      acc + (dateTimeTo.getTime() - dateTimeFrom.getTime()) / 1000 / 60 / 60
    ); // milliseconds to hours
  }, 0);
  return totalHours.toFixed(2);
});

const timerRunning = ref(false);
const startTime = ref<Date | null>(null);
const elapsedTime = ref(0);
const intervalRef = ref<number | null>(null);
const timerTimeLogId = ref<number | null>(null);

const { execute: createTimeLog } = useAxios({
  method: "post",
  url: `time-log/create`,
});

const { execute: getTimeLogByTask } = useAxios({
  method: "get",
  url: `time-log/get-by-task/${props.task.task.id}`,
});

// Function to start the timer
const startTimer = async () => {
  startTime.value = new Date();
  const timeLogCreate: TimeLogCreate = {
    task_id: props.task.task.id,
    user_id: useUserStore().getData()?.id ?? "",
    description: `${props.task.task.description} - Automatic Time Log`,
    date: new Date().toISOString().split("T")[0],
    time_from: new Date().toISOString().split("T")[1],
    time_to: "00:00:00",
    estimated_time_left: 0,
  };
  // Create a record in the database
  createTimeLog(timeLogCreate).then((res: TimeLog) => {
    timerTimeLogId.value = res.id;
    // emitter.emit(`timeLogAdded${props.task.task.id}`, {
    //   timeLogId: res.id,
    //   timeLog: res,
    //   edited: true,
    // });
  });

  timerRunning.value = true;
  intervalRef.value = setInterval(() => {
    elapsedTime.value = Date.now() - startTime.value!.getTime();
  }, 1000) as unknown as number;
};

// Function to stop the timer
const stopTimer = async () => {
  if (intervalRef.value) {
    clearInterval(intervalRef.value);
  }
  const endTime = new Date();

  // Update the record in the database
  if (timerTimeLogId.value) {
    const timeLogUpdate: TimeLogUpdate = {
      task_id: props.task.task.id,
      user_id: useUserStore().getData()?.id ?? "",
      description: `${props.task.task.description} - Automatic Time Log`,
      date: new Date().toISOString().split("T")[0],
      time_from: new Date(startTime.value).toISOString().split("T")[1],
      time_to: new Date(endTime).toISOString().split("T")[1],
      estimated_time_left: 0,
    };
    const { execute: updateTimeLog } = useAxios({
      method: "put",
      url: `time-log/update/${timerTimeLogId.value}`,
    });

    updateTimeLog(timeLogUpdate).then(() => {
      timerTimeLogId.value = null;
      // emitter.emit(`timeLogEdited${props.task.task.id}`, {
      //   timeLogId: res.id,
      //   timeLog: res,
      //   edited: true,
      // });
    });
  }
  timerRunning.value = false;
  elapsedTime.value = 0;
};

// Toggle the timer on/off
const toggleTimer = () => {
  if (timerRunning.value) {
    stopTimer();
  } else {
    startTimer();
  }
};

// Format elapsed time into a readable string
const formatElapsedTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return `${hours}:${minutes % 60}:${seconds % 60}`;
};

// Check for an existing timer on component mount
onMounted(() => {
  getTimeLogByTask().then((response: TimeLog[]) => {
    const ongoingTimer = response.find(
      (log) =>
        log.description.includes("- Automatic Time Log") &&
        log.time_to === "00:00:00",
    );
    if (ongoingTimer) {
      startTime.value = new Date(
        ongoingTimer.date + "T" + ongoingTimer.time_from,
      );
      timerTimeLogId.value = ongoingTimer.id;
      intervalRef.value = setInterval(() => {
        elapsedTime.value = Date.now() - startTime.value.getTime();
      }, 1000);
      timerRunning.value = true;
    }
  });
});

// Clear the interval when the component is unmounted
onUnmounted(() => {
  if (intervalRef.value) {
    clearInterval(intervalRef.value);
  }
});

const user = useUserStore().getData();
const emit = defineEmits(["taskUpdated", "taskDeleted"]);

const constructInitials = (task: StoryTask) => {
  if (!task.assignee) {
    return "N/A";
  }

  return `${task.assignee.first_name.charAt(0).toUpperCase()}${task.assignee.last_name.charAt(0).toUpperCase()}`;
};

const {
  execute: updateTask,
  isLoading,
  isError,
  error,
} = useAxios<StoryTask>({
  method: "put",
  url: ``,
});

const { execute: deleteTask } = useAxios({
  method: "delete",
  url: ``,
});

const handleDeleteTask = () => {
  if (!confirm("Are you sure?")) {
    return;
  }
  // For some reason we have to pass Id of endpoint again because sometimes different task id is used
  deleteTask({}, `task/delete/${props.task.task.id}`).then(() => {
    useToast().success("Deleted a task", { position: "top" });
    emit("taskDeleted", props.task.task.id);
  });
};

const changeTaskStatus = (status: "ACCEPTED" | "NULL" | "COMPLETED") => {
  // For some reason we have to pass Id of endpoint again because sometimes different task id is used
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

const logTime = () => {
  logTimeMenu.value = true;
};

const updateTaskAssignee = (assignee: { user: string | null }) => {
  // For some reason we have to pass Id of endpoint again because sometimes different task id is used
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

emitter.on(
  `taskEdited${props.task.task.id}`,
  ({
    taskId,
    description,
    edited,
  }: {
    taskId: number;
    description: string;
    edited: boolean;
  }) => {
    console.log(taskId, description, edited);
    if (taskId !== props.task.task.id) {
      return;
    }

    editMode.value = false;
    optionsMenu.value = false;

    if (edited) {
      taskDescription.value = description;
    }
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
      <div v-if="!editMode" class="w-full flex items-center">
        <div class="text-sm grow">
          {{ taskDescription }}
        </div>
        <div class="shrink flex justify-end items-center space-x-2">
          <Alert v-if="isError" :message="error.message.error" type="error" />
          <div v-if="isLoading">
            <Loader />
          </div>
          <div
            v-if="
              task.task.status === 'PENDING' && task.assignee.id !== user?.id
            "
            class="rounded-md border py-1 px-2 text-xs bg-blue-400 border-blue-600 text-white"
          >
            Pending
          </div>
          <div
            v-if="
              task.task.status === 'PENDING' && task.assignee.id === user?.id
            "
            class="rounded-md border cursor-pointer py-1 px-2 text-xs bg-green-400 border-green-600 text-white"
            @click="changeTaskStatus('ACCEPTED')"
          >
            Accept
          </div>
          <div
            v-if="
              task.task.status === 'PENDING' && task.assignee.id === user?.id
            "
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
            <v-card min-width="400" v-if="task.task.status !== 'COMPLETED'">
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
                    :estimation="timeEstimationValue"
                    class="mt-2"
                  />
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
          <v-menu v-if="elapsedTime" location="bottom">
            <template v-slot:activator="{ props }">
              <div
                v-bind="props"
                class="min-w-16 bg-green-100 rounded-md border border-gray-500 py-1 px-2 text-xs text-gray-700 flex items-center justify-between space-x-1"
              >
                <span><v-icon icon="mdi-clock-start" size="small" />:</span>
                <span>{{ formatElapsedTime(elapsedTime) }}</span>
              </div>
            </template>
          </v-menu>
          <v-menu
            v-if="
              user?.id === task.task.assignee_id &&
              task.task.status !== 'COMPLETED' &&
              task.task.status !== 'PENDING'
            "
            v-model="logTimeMenu"
            :close-on-content-click="false"
            location="bottom"
          >
            <template v-slot:activator="{ props }">
              <div
                v-bind="props"
                class="min-w-16 rounded-md border border-gray-500 cursor-pointer py-1 px-2 text-xs text-gray-700 flex items-center justify-between space-x-1"
              >
                <span><v-icon icon="mdi-timer-sand" size="small" />:</span>
                <span>{{ logTimeCombinedValue }}h</span>
              </div>
            </template>
            <v-card wv-if="task.task.status !== 'COMPLETED'">
              <v-list>
                <v-list-item prepend-icon="mdi-timer-sand" subtitle="Log time">
                </v-list-item>
                <v-list-item>
                  <TimeLogsForm
                    :timeLogs="timeLogs"
                    :task="task.task"
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
                    v-if="task.task.status !== 'COMPLETED'"
                    prepend-icon="mdi-pencil-circle-outline"
                    title="Edit Task"
                    value="edit"
                    @click="editMode = true"
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
                    v-if="
                      user?.id === task.task.assignee_id &&
                      (task.task.status === 'ACTIVE' ||
                        task.task.status === 'ACCEPTED')
                    "
                    prepend-icon="mdi-clock-start"
                    :title="`${timerRunning ? 'Stop' : 'Start'} Timer`"
                    @click="toggleTimer()"
                    value="toggletimer"
                  />
                  <v-list-item
                    v-if="
                      user?.id === task.task.assignee_id &&
                      (task.task.status === 'ACTIVE' ||
                        task.task.status === 'ACCEPTED')
                    "
                    prepend-icon="mdi-timer-sand"
                    title="Log Time"
                    @click="logTime()"
                    value="logtime"
                  />
                  <v-list-item
                    v-if="task.task.status !== 'COMPLETED'"
                    prepend-icon="mdi-delete-circle-outline"
                    title="Delete"
                    value="delete"
                    @click="handleDeleteTask()"
                  />
                </v-list>
              </v-list>
            </v-card>
          </v-menu>
        </div>
      </div>
      <EditTaskForm
        v-else
        :task-id="task.task.id"
        :description="taskDescription"
        class="w-full"
      />
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
