<script setup lang="ts">
import { SprintTable } from "@/components/Common";
import { onMounted, ref } from "vue";
import { Sprint, TableSprints } from "@/features/sprints";

type SprintsTableProps = {
  sprints: Sprint[];
};

const props = defineProps<SprintsTableProps>();
const sprintsData = ref<TableSprints[]>([]);

const mapSprintsData = (sprints: Sprint[]): TableSprints[] => {
  return sprints.map((sprint: Sprint): TableSprints => {
    return {
      info: { id: sprint.id },
      velocity: sprint.velocity,
      start_date: sprint.start_date,
      end_date: sprint.end_date,
    };
  });
};

const headers = ["Velocity", "Start", "End"];
onMounted(() => {
  console.log(props.sprints);
  sprintsData.value = mapSprintsData(props.sprints).reverse();
});
</script>

<template>
  <div class="w-full h-full">
    <SprintTable
      :headers="headers"
      :rows="sprintsData"
      :display-actions="true"
      class="h-full"
    />
  </div>
</template>
