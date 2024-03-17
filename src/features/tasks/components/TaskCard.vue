<script setup lang="ts">
import { Task } from "@/features/tasks/types";
import { ref } from "vue";
import { SelectAssigneForm } from "@/features/tasks";

type TaskCardProps = {
  task: Task;
  projectId: number;
};

defineProps<TaskCardProps>();

const menu = ref(false);

const constructInitials = (task: Task): string => {
  if(!task.assignee_id) {
    return 'N/A';
  }

  return `${task.assignee_first_name?.charAt(0)}${task.assignee_last_name?.charAt(0)}`;
}

</script>

<template>
  <div class="flex justify-between items-center gap-x-2 text-sm">
    <p class="grow px-4 py-3 border border-gray-500 rounded-md">
      {{ task.description }}
    </p>
    <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
      <template v-slot:activator="{ props }">
        <div
          v-bind="props"
          class="p-2 rounded-full border border-gray-500 cursor-pointer min-w-10 text-center text-gray-700"
        >
          {{ constructInitials(task) }}
        </div>
      </template>
      <v-card min-width="400">
        <v-list>
          <v-list-item prepend-icon="mdi-account" subtitle="Assign a User">
          </v-list-item>
          <v-list-item>
            <SelectAssigneForm :assignedUserId="task.assignee_id" :projectId="projectId" class="mt-4" />
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>
