<template>
  <div class="w-full h-full flex flex-col space-y-8">
    <Section
      title="Add a new user"
      description="Create a new user that will be able to join the platform."
      icon="mdi-account-plus"
      class="shrink"
    >
      <BtnDialog
        title="Create new user"
        btnText="Create"
        btnIcon="mdi-plus"
        :dialogWidth="600"
        :displayActionBtn="false"
      >
        <CreateForm />
      </BtnDialog>
    </Section>
    <Section
      title="All users"
      description="Displayed table that shows all the users on the platform"
      icon="mdi-account-group-outline"
      class="grow"
    >
      <UsersTable />
    </Section>
  </div>
</template>

<script setup lang="ts">
import { CreateForm, UsersTable } from "../components";
import { BtnDialog, Section } from "@/components/Common";
</script>
