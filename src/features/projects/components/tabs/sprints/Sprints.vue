<template>
  <div class="w-75 flex-column" style="margin-left: auto; margin-right: auto">
    <div class="flex mx-4">
      <div class="w-66 flex space-y-8">
        <Section
          title="All sprints."
          icon="mdi-view-dashboard"
          description="Here are all the sprints for this project. Click the one you want to expand"
        >
        </Section>
      </div>
      <div class="w-33 flex justify-end">

        <Section
          class="text-end"
          title="Add a new sprint"
          icon="mdi-plus-box"
        >
          <Dialog
            style="margin-top: -15px"
            title="Create new Sprint"
            btnText="Create"
            btnIcon="mdi-plus"
            :dialogWidth="600"
            :displayActionBtn="false"
          >
          </Dialog>
        </Section>
      </div>
    </div>
    <div class="grow w-full grid grid-cols-1 gap-5 mt-3 ">

    </div>
  </div>
</template>
<script setup lang="ts"></script>
