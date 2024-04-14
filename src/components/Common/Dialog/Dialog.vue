<template>
  <v-dialog v-model="isActive" :width="dialogWidth">
    <v-card rounded="lg" class="px-5 flex flex-col space-y-4">
      <v-card-title class="p-0 flex justify-between items-center">
        <div class="text-h5 text-medium-emphasis">
          {{ title }}
        </div>

        <v-btn
          icon="mdi-close"
          rounded="xl"
          size="small"
          variant="text"
          @click="emits('close-dialog')"
        ></v-btn>
      </v-card-title>

      <div class="w-full">
        <slot></slot>
      </div>

      <div v-if="displayActionBtn" class="flex justify-end">
        <v-btn
          class="text-none"
          color="primary"
          rounded="md"
          :text="actionBtnText"
          variant="flat"
          @click="emits('close-dialog')"
        ></v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import emitter from "@/plugins";

type DialogProps = {
  dialogWidth: number;
  title: string;
  displayActionBtn: boolean;
  actionBtnText?: string;
  showDialog: boolean;
};

const props = defineProps<DialogProps>();
const emits = defineEmits(["close-dialog"]);

const isActive = ref(false);

watch(
  () => props.showDialog,
  (newVal: boolean) => {
    isActive.value = newVal;
  },
);

emitter.on("dialogClose", () => {
  emits("close-dialog");
});
</script>
