<script setup lang="ts">
import { SprintTable } from "@/components/Common";
import { onMounted, ref } from "vue";
import { formattedDate } from "@/utils/date";
import { Sprint, TableSprints } from "@/features/sprints";

type SprintsTableProps = {
  sprints: Sprint[];
};

const props = defineProps<SprintsTableProps>();
const sprintsData = ref<TableSprints[]>([]);

const mapSprintsData = (sprints: Sprint[]): TableSprints[] => {
  return sprints.map((sprint: Sprint): TableSprints => {
    return {
      velocity: sprint.velocity,
      start_date: formattedDate(sprint.start_date),
      end_date: formattedDate(sprint.end_date),
    };
  });
};

const headers = ["Velocity", "Start", "End"];
onMounted(() => {
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
