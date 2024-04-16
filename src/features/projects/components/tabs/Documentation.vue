<script setup lang="ts">
import emitter from "@/plugins";
import { useField, useForm } from "vee-validate";
import { useAxios } from "@/composables/useAxios";
import { Loader } from "@/components/Common";
import { Alert } from "@/components/Alert";
import { useToast } from "vue-toast-notification";
import { Documentation } from "../../types";
import { Project } from "@/features/projects";
import { onBeforeMount, ref } from "vue";

type DocumentationProps = {
  project: Project;
};

const props = defineProps<DocumentationProps>();

const { handleSubmit } = useForm({
  validationSchema: {
    documentation(value) {
      if (value) return true;

      return "Documentation is required!";
    }
  },
});

const documentation = useField("documentation");

const { execute: createDocs, isLoading, error, isError } = useAxios<Documentation>({
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

const docsExist = ref<boolean>(false);

onBeforeMount(() => {
    getDocs().then((res: Documentation[]) => {
        docsExist.value = res.length > 0;
        documentation.value.value = res[0].text;
  });
});

const submit = handleSubmit((values) => {
    if (docsExist.value) {
        updateDocs({
            project_id: props.project.id,
            text: values.documentation,
            date: new Date(),
        }).then((docs: Documentation) => {
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
        }).then((docs: Documentation) => {
            useToast().success(`Documentation for project successfully created!`, {
            position: "top",
            });
            emitter.emit("dialogClose");
        });
    }
});

</script>

<template>
  <Alert
    v-if="isError"
    :message="error.message.error"
    type="error"
    class="mb-5"
  />
  <form fast-fail @submit.prevent="submit">
    <div class="flex items-center w-full justify-between space-x-2 pt-2">
        <v-textarea
        v-model="documentation.value.value"
        :error-messages="documentation.errorMessage.value"
        label="Documentation"
        variant="outlined"
        density="compact"
        no-resize
        class="w-full"
        ></v-textarea>
    </div>
    <div class="w-full flex justify-end">
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
  <div v-if="isLoading" class="mt-2 flex justify-center">
    <Loader />
  </div>
</template>
