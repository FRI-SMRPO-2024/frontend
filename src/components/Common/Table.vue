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
        <td>{{ idx + 1 }}</td>
        <td v-for="(item, idx) in row" :key="idx">{{ item }}</td>
        <td
          v-if="displayActions"
          class="flex items-center flex-start space-x-1"
        >
          <BtnDialog
            btnIcon="mdi-pencil-circle"
            btnText=""
            title=""
            :dialogWidth="600"
            :displayActionBtn="false"
            size="sm"
            color="white"
            iconColor="blue-lighten-2"
          >

            <UpdateForm
              :usernameProp="row.username"
              :firstNameProp="row.firstName"
              :lastNameProp="row.lastName"
              :emailProp="row.email"
              :roleProp="row.role"
            />
          </BtnDialog>
          <v-btn
            color="red-lighten-2"
            icon="mdi-delete-circle"
            variant="text"
            size="sm"
            @click="deleteUser(row.email)"
          ></v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>

  <v-dialog v-model="editDialog">
    <CreateForm />
  </v-dialog>
</template>

<script setup lang="ts">
import CreateForm from "@/features/users/components/CreateForm.vue";
import {ref} from "vue";
import { BtnDialog } from "@/components/Common";
import UpdateForm from "@/features/users/components/UpdateForm.vue";
import {useAxios} from "@/composables/useAxios";
import {useToast} from "vue-toast-notification";
import emitter from "@/plugins";

type TableProps = {
  headers: string[];
  rows: object[];
  displayActions: boolean;
};
defineProps<TableProps>();

const editDialog = ref(false);

const deleteUser = async (email) => {
  console.log(email)
  const {execute: executeId} = useAxios({
    method: "post",
    url: "user/get",
  });

  const responseId = await executeId({
    email: email
  })
  console.log(responseId)

  const {execute: executeDelete, isError} = useAxios({
    method: "delete",
    url: "user/delete/" + responseId.id,
  });
  const responseDelete = await executeDelete()

  if (!isError.value) {
    useToast().success(`User successfully deleted!`, {
      position: "top",
    });
  } else {
    useToast().error(`Error while deleting user!`, {
      position: "top",
    });
  }
  emitter.emit("dialogClose");
  console.log(responseDelete)
}

</script>

