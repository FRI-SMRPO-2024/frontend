<template>
  <div class="w-full">
    <v-btn
      @click="isActive = true"
      :prepend-icon="btnIcon"
      variant="flat"
      color="#5865f2"
    >
      <div class="text-none font-weight-regular">{{ btnText }}</div>
      <v-dialog v-model="isActive" :width="dialogWidth"
        ><!--max-width="500"-->
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
              @click="isActive = false"
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
              @click="isActive = false"
            ></v-btn>
          </div>
        </v-card>
      </v-dialog>
    </v-btn>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import emitter from "@/plugins";

type DialogProps = {
  dialogWidth: number;
  btnText: string;
  btnIcon?: string;
  title: string;
  displayActionBtn: boolean;
  actionBtnText?: string;
};

defineProps<DialogProps>();

const isActive = ref(false);

emitter.on("dialogClose", () => {
  isActive.value = false;
});
</script>
