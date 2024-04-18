<template>
  <div
    class="rounded-md border-gray-100 border p-2 rounded-3xl p-4 w-full transition duration-300 ease-in-out hover:shadow-md"
  >
    <div class="flex justify-start space-x-4">
      <img
        src="../../../assets/project_placeholder.png"
        class="rounded-lg w-52"
      />
      <div class="flex flex-column w-full">
        <div class="grow">
          <div class="w-full flex justify-between items-center mb-2">
            <span class="text-lg text-gray-800 font-bold leading-none">{{
              data.name
            }}</span>
            <div class="flex justify-start space-x-2 items-center">
              <span class="cursor-pointer" @click="handleProjectEdit">
                <v-icon
                  icon="mdi-pencil-outline"
                  size="x-small"
                  color="blue"
                ></v-icon>
              </span>
              <span class="cursor-pointer" @click="handleProjectDelete">
                <v-icon
                  icon="mdi-delete-outline"
                  size="x-small"
                  color="red"
                ></v-icon>
              </span>
              <Dialog
                title="Edit a project"
                :show-dialog="editDialog"
                :display-action-btn="false"
                :dialog-width="600"
                @closeDialog="editDialog = false"
                @click:outside="editDialog = false"
              >
                <EditProjectForm
                  :project="data"
                  @projectUpdated="console.log"
                />
              </Dialog>
            </div>
          </div>
          <div class="flex-auto text-gray-500 my-1 line-clamp-3">
            {{ data.description }}
          </div>
        </div>
        <div class="shrink flex justify-end w-full mt-3">
          <v-btn
            class="text-none"
            variant="flat"
            color="#5865f2"
            rounded="lg"
            append-icon="mdi-chevron-right"
            @click="handleProjectOpen(data.id)"
          >
            More
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { EditProjectForm, Project } from "@/features/projects";
import { useRouter } from "vue-router";
import { useAxios } from "@/composables/useAxios";
import { useToast } from "vue-toast-notification";
import { Dialog } from "@/components/Common";
import { ref } from "vue";
type ProjectCardProps = {
  data: Project;
};

const props = defineProps<ProjectCardProps>();
const emits = defineEmits(["projectDeleted"]);
const router = useRouter();

const editDialog = ref<boolean>(false);

const handleProjectDelete = () => {
  if (!confirm("Are you sure?")) {
    return;
  }

  const { execute: deleteTask } = useAxios({
    method: "delete",
    url: `project/delete/${props.data.id}`,
  });

  deleteTask().then(() => {
    useToast().success("Deleted a project", { position: "top" });
    emits("projectDeleted", props.data.id);
  });
};

const handleProjectEdit = () => {
  editDialog.value = true;
};

const handleProjectOpen = (projectId: number) => {
  router.push({ name: "projects.view", params: { id: projectId } });
};
</script>
