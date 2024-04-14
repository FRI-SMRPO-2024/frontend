<script setup lang="ts">
import { Dialog } from "@/components/Common";
import { ref } from "vue";

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
</script>

<template>
  <div class="w-full">
    <v-btn
      @click="isActive = true"
      :prepend-icon="btnIcon"
      variant="flat"
      color="#5865f2"
    >
      <div class="text-none font-weight-regular">{{ btnText }}</div>
      <Dialog
        :title="title"
        :display-action-btn="false"
        :dialog-width="dialogWidth"
        btn-text=""
        :show-dialog="isActive"
        @close-dialog="isActive = false"
        @click:outside="isActive = false"
      >
        <slot></slot>
      </Dialog>
    </v-btn>
  </div>
</template>
