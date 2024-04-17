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
  color?: string;
  iconColor?: string;
};

defineProps<DialogProps>();
const isActive = ref(false);
</script>

<template>
  <div class="w-full">
    <v-btn
      @click="isActive = true"
      variant="flat"
      :color="color ? color : '#5865f2'"
    >
      <v-icon :color="iconColor ? iconColor : 'white'">{{ btnIcon }}</v-icon>
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
