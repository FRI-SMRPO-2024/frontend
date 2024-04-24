<template>
  <v-table height="300px" fixed-header>
    <thead>
      <tr>
        <th class="text-left">#</th>
        <th v-for="(header, idx) in headers" :key="idx">{{ header }}</th>
        <th v-if="displayActions" class="text-left">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, idx) in rows" :key="idx">
        <td
          :bgcolor="
            new Date() < new Date(row.end_date)
              ? new Date() < new Date(row.start_date)
                ? ''
                : '#f0f8ff'
              : '#e5fbe5'
          "
        >
          {{ idx + 1 }}
        </td>
        <td v-for="(item, idx) in filteredRow(row)" :key="idx">
          {{ isValidDateFormat(item) ? formattedDate(item) : item }}
        </td>
        <td
          v-if="
            displayActions && useUserStore().getRole().includes('SCRUM_MASTER')
          "
          class="flex items-center flex-start space-x-1"
        >
          <v-btn
            v-if="new Date() < new Date(row.start_date)"
            color="blue-lighten-2"
            prepend-icon="mdi-pencil-circle"
            variant="text"
            size="sm"
            @click="isActive = true"
          >
            <div class="text-none font-weight-regular">{{ btnText }}</div>
            <Dialog
              :title="title"
              :display-action-btn="false"
              dialog-width="900"
              btn-text=""
              :show-dialog="isActive"
              @close-dialog="isActive = false"
              @click:outside="isActive = false"
            >
              <UpdateForm
                :prop_velocity="row.velocity"
                :prop_start_date="row.start_date"
                :prop_end_date="row.end_date"
                :sprint_id="row.info.id"
              ></UpdateForm>
            </Dialog>
          </v-btn>
          <v-btn
            v-if="new Date() < new Date(row.start_date)"
            color="red-lighten-2"
            icon="mdi-delete-circle"
            variant="text"
            size="sm"
            @click="deleteSprint(row.info.id)"
          ></v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { formattedDate } from "@/utils/date";
import { useAxios } from "@/composables/useAxios";
import emitter from "@/plugins";
import { Dialog } from "@/components/Common";
import { ref } from "vue";
import UpdateForm from "@/features/sprints/components/UpdateForm.vue";
import { useUserStore } from "@/stores/user.store";

type TableProps = {
  headers: string[];
  rows: object[];
  displayActions: boolean;
};

defineProps<TableProps>();
const isActive = ref(false);

function isValidDateFormat(dateString) {
  // Regular expression to match the format 'YYYY-MM-DD'
  let dateFormat = /^\d{4}-\d{2}-\d{2}$/;
  return dateFormat.test(dateString);
}

function filteredRow(row) {
  // Create a new object without the 'info' key
  const filteredRow = { ...row };
  delete filteredRow.info;
  return Object.values(filteredRow);
}

async function deleteSprint(id) {
  console.log(id);
  const { execute } = useAxios({
    method: "delete",
    url: `sprint/delete/${id}`,
  });

  await execute();
  emitter.emit("dialogClose");
}
</script>
