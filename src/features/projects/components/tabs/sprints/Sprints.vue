<template>
  <div class="w-75 flex-column" style="margin-left: auto; margin-right: auto">
    <div class="flex mx-4">
      <div class="w-66 flex space-y-8">
        <Section
          title="All sprints."
          icon="mdi-view-dashboard"
          description="Here are all the sprints for this project. Click the one you want to expand"
        >
        </Section>
      </div>
      <div class="w-33 flex justify-end">
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
              :project="props.project"
              @get-sprints="triggergetSprints"
            ></CreateForm>
          </Dialog>
        </Section>
      </div>
    </div>
    <div class="grow w-full grid grid-cols-1 gap-5 mt-4">
      <SprintCard
        v-for="(sprint, idx) in sprints"
        :key="idx"
        :data="sprint"
        :idx="idx"
      >
      </SprintCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import CreateForm from "@/features/projects/components/tabs/sprints/CreateForm";
import SprintCard from "@/features/projects/components/tabs/sprints/SprintCard";
import { onMounted, ref } from "vue";
import { useAxios } from "@/composables/useAxios";
import { Project } from "@/features/projects";

let sprints = ref([]);

type SprintProps = {
  project: Project;
};

const props = defineProps<SprintProps>();
console.log(props.project.id);

const triggergetSprints = () => {
  const { execute: getSprints } = useAxios({
    method: "get",
    url: `sprint/get-by-project-id/${props.project.id}`,
  });

  getSprints().then((returned: []) => {
    sprints.value = returned;
    console.log(sprints);
  });
};

onMounted(() => {
  triggergetSprints();
});
</script>
