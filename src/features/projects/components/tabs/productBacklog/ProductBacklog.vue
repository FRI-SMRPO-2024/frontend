<template>
  <div class="w-full flex align-center flex-col space-y-8">
    <Section
      title="Add a new story"
      description="Create a new story for this project."
      icon="mdi-plus-box"
    >
      <Dialog
        title="Create new story"
        btnText="Create"
        btnIcon="mdi-plus"
        :dialogWidth="600"
        :displayActionBtn="false"
      >
        <CreateForm></CreateForm>
      </Dialog>
    </Section>
  </div>
</template>
<script setup lang="ts"></script>
<script>
import CreateForm from "@/features/projects/components/tabs/productBacklog/CreateForm";
export default {
  components: {CreateForm}
}
</script>
