<template>
  <AuthLayout>
    <div class="w-1/5 mb-10">
      <div
        class="w-full flex flex-col items-center justify-start space-y-2 mb-10"
      >
        <div className="flex justify-center">
          <img alt="" className="h-14 w-14" src="@/assets/logo.png" />
        </div>
        <h2 className="mt-5 text-center text-3xl font-extrabold text-gray-900">
          Login to your account
        </h2>
        <p className="text-center text-sm text-gray-600">
          Enter your email and password to access Fake Jira
        </p>
      </div>
      <LoginForm />
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { AuthLayout, LoginForm } from "../components/";
</script>
