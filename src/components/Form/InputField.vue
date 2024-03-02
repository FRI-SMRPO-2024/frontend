<script setup lang="ts">


import {ref, toRef} from "vue";
import { useField } from "vee-validate";

import FieldWrapper from "@/components/Form/FieldWrapper.vue";

interface InputFieldProps {
  name: string;
  label: string;
  type?: "text" | "email" | "password";
  value?: string;
}

const props = withDefaults(defineProps<InputFieldProps>(), {
  type: "text",
});

const name = toRef(props, "name");

const inputRef = ref();
const displayPassword = ref(false);

const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
} = useField(name, undefined, {
  initialValue: props.value,
});

function togglePasswordVisibility() {
  displayPassword.value = !displayPassword.value;
  inputRef.value.type = displayPassword.value ? 'text' : 'password';
}
</script>

<template>
  <FieldWrapper :label="label" :errorMessage="errorMessage">
    <div class="relative">
      <input
        ref="inputRef"
        :name="name"
        :id="name"
        :type="type"
        :value="inputValue"
        @input="handleChange"
        @blur="handleBlur"
        class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
      <span
        v-if="type === 'password'"
        class="cursor-pointer absolute top-1/2 translate-y-[-50%] right-4"
        @click="togglePasswordVisibility()"
      >
      <v-icon :icon="displayPassword ? 'mdi-eye-off' : 'mdi-eye'"></v-icon>
    </span>
    </div>
  </FieldWrapper>
</template>
