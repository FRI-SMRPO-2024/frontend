<template>
  <div class="w-75 flex-column" style="margin-left: auto; margin-right: auto">
    <div class="flex mx-4">
      <div class="w-66 flex space-y-8">
        <Section
          title="All sprints."
          icon="mdi-view-dashboard"
          description="Here are all the sprints for this project."
        >
        </Section>
      </div>
      <div
        v-if="useUserStore().getRole() === 'SCRUM_MASTER'"
        class="w-33 flex justify-end"
      >
        <Section class="text-end" title="Add a new sprint" icon="mdi-plus-box">
          <Dialog
            style="margin-top: -15px"
            title="Create new Sprint"
            btnText="Create"
            btnIcon="mdi-plus"
            :dialogWidth="900"
            :displayActionBtn="false"
          >
            <CreateForm
              :project="project"
              @get-sprints="fetchSprintsData"
            ></CreateForm>
          </Dialog>
        </Section>
      </div>
    </div>
    <div class="grow w-full mt-4">
      <Alert v-if="isError" :message="error.message.error" type="error" />
      <SprintsTable
        v-if="!isLoading && sprints.length > 0"
        :sprints="sprints"
      />
      <div v-if="isLoading" class="flex justify-center">
        <Loader />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { CreateForm, Sprint, SprintsTable } from "@/features/sprints";
import { Project } from "@/features/projects";
import { useUserStore } from "@/stores/user.store";
import { useAxios } from "@/composables/useAxios";
import { onMounted, ref } from "vue";
import { Alert } from "@/components/Alert";
import { Loader } from "@/components/Common";
import emitter from "@/plugins";

type SprintProps = {
  project: Project;
};

const props = defineProps<SprintProps>();
const sprints = ref<Sprint[]>([]);
const { execute, isLoading, isError, error } = useAxios<Sprint[]>({
  method: "get",
  url: `sprint/get-by-project-id/${props.project.id}`,
});

const fetchSprintsData = (): void => {
  execute().then((res: Sprint[]) => {
    sprints.value = res;
  });
};

onMounted(() => {
  fetchSprintsData();
});

emitter.on("dialogClose", () => {
  fetchSprintsData();
});
</script>
