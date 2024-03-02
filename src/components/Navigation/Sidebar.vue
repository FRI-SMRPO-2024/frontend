<template>
    <v-navigation-drawer
        theme="dark"
        permanent
        :width="320"
      >
        <v-list>
          <v-list-item
            prepend-avatar="@/assets/logo.png"
            subtitle="SMRPO Group 2"
            title="Jira Clone"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>
        <v-divider></v-divider>


        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-home-city" title="Dashboard" value="home"></v-list-item>
          <v-list-item prepend-icon="mdi-view-dashboard-edit-outline" title="Projects" value="account"></v-list-item>
          <v-list-item prepend-icon="mdi-account-group-outline" title="Users" value="users"></v-list-item>
        </v-list>
      </v-navigation-drawer>
</template>