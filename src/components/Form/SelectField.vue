<script setup lang="ts">
import { useField } from "vee-validate";

import FieldWrapper from "@/components/Form/FieldWrapper.vue";

import type { FieldWrapperProps } from "@/components/Form/FieldWrapper.vue";

// TODO: Label to React.Node
type Option = {
  label: string;
  value: string | number | string[];
};

interface SelectFieldProps extends FieldWrapperProps {
  name: string;
  label: string;
  options?: Option[];
  value?: string;
  placeholder?: string;
  registration?: undefined;
}

// TODO: Maybe, should use vite-plugin-vue-type-imports
//  https://github.com/wheatjs/vite-plugin-vue-type-imports
const props = defineProps<SelectFieldProps>();
const option = props.options && props.options[0];

const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
} = useField(props.name, undefined, {
  initialValue: props.value || option?.value,
});
</script>

<template>
  <FieldWrapper :label="label" :errorMessage="errorMessage">
    <select
      :name="name"
      :id="name"
      :value="inputValue"
      @change="handleChange"
      @blur="handleBlur"
      class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    >
      <option v-for="{ label, value } in options" :key="label" :value="value">
        {{ label }}
      </option>
    </select>
  </FieldWrapper>
</template>
