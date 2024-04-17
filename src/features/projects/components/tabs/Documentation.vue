<script setup lang="ts">
import emitter from "@/plugins";
import { useField, useForm } from "vee-validate";
import { useAxios } from "@/composables/useAxios";
import { Loader } from "@/components/Common";
import { Alert } from "@/components/Alert";
import { useToast } from "vue-toast-notification";
import { Documentation } from "../../types";
import { Project } from "@/features/projects";
import { onBeforeMount, ref, Ref } from "vue";

type DocumentationProps = {
  project: Project;
};

const props = defineProps<DocumentationProps>();

const docsExist = ref<boolean>(false);

const { handleSubmit } = useForm({
  validationSchema: {
    documentation(value: string | null) {
      if (value) return true;

      return "Documentation is required!";
    },
  },
});

const documentation = useField("documentation");

onBeforeMount(() => {
  getDocs().then((res: Documentation[]) => {
    docsExist.value = res.length > 0;
    if (docsExist.value) {
      documentation.value.value = res[0].text;
    }
  });
});

const {
  execute: createDocs,
  isLoading,
  error,
  isError,
} = useAxios<Documentation>({
  method: "post",
  url: "documentation/create",
});

const { execute: updateDocs } = useAxios<Documentation>({
  method: "put",
  url: "documentation/update/" + props.project.id,
});

const { execute: getDocs } = useAxios<Documentation[]>({
  method: "get",
  url: "documentation/get-by-project/" + props.project.id,
});

const submit = handleSubmit((values) => {
  if (docsExist.value) {
    updateDocs({
      project_id: props.project.id,
      text: values.documentation,
      date: new Date(),
    }).then(() => {
      useToast().success(`Documentation for project successfully updated!`, {
        position: "top",
      });
      emitter.emit("dialogClose");
    });
  } else {
    createDocs({
      project_id: props.project.id,
      text: values.documentation,
      date: new Date(),
    }).then(() => {
      useToast().success(`Documentation for project successfully created!`, {
        position: "top",
      });
      docsExist.value = true;
      emitter.emit("dialogClose");
    });
  }
});

const fileInput: Ref<HTMLInputElement | null> = ref(null);

// Function to trigger the hidden file input
function triggerFileInput() {
  fileInput.value?.click();
}

// Function to read a text file and set its content to the textarea
function importFile(event) {
  const file = event.target.files[0];
  if (file && file.type === "text/plain") {
    const reader = new FileReader();
    reader.onload = (e) => {
      documentation.value.value = e.target?.result;
    };
    reader.readAsText(file);
  } else {
    useToast().error("Invalid file type. Please select a text file.");
  }
}

// Function to export textarea content to a text file
function exportToFile() {
  const element = document.createElement("a");
  const file = new Blob([documentation.value.value], {
    type: "text/plain",
  });
  element.href = URL.createObjectURL(file);
  element.download = `documentation-${props.project.id}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
</script>

<template>
  <Alert
    v-if="isError"
    :message="error.message.error"
    type="error"
    class="mb-5"
  />
  <div class="w-75 flex-column" style="margin-left: auto; margin-right: auto">
    <form fast-fail @submit.prevent="submit">
      <div class="flex items-center w-full justify-between space-x-2 pt-2">
        <v-textarea
          v-model="documentation.value.value"
          :error-messages="documentation.errorMessage.value"
          label="Documentation"
          variant="outlined"
          density="compact"
          no-resize
          class="w-full h-full"
        ></v-textarea>
      </div>
      <div class="w-full flex justify-between">
        <div class="space-x-2">
          <input
            type="file"
            ref="fileInput"
            @change="importFile"
            accept=".txt"
            style="display: none"
          />
          <v-btn
            @click="triggerFileInput"
            prepend-icon="mdi-import"
            variant="flat"
            color="#5865f2"
          >
            Import
          </v-btn>
          <v-btn
            @click="exportToFile"
            prepend-icon="mdi-export"
            variant="flat"
            color="#5865f2"
          >
            Export
          </v-btn>
        </div>
        <v-btn
          class="w-2/5"
          type="submit"
          prepend-icon="mdi-plus-circle"
          variant="flat"
          color="#5865f2"
        >
          Save documentation
        </v-btn>
      </div>
    </form>
  </div>
  <div v-if="isLoading" class="mt-2 flex justify-center">
    <Loader />
  </div>
</template>
