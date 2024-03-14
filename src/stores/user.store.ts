import { defineStore } from "pinia";
import { ref } from "vue";
import { AuthUser } from "@/features/auth";

export const useUserStore = defineStore("user", () => {
  const user = ref<AuthUser | null>(null);

  const add = (authUser: AuthUser) => {
    user.value = authUser;
  };

  const remove = () => {
    user.value = null;
  };

  const isAuthenticated = (): boolean => !!user.value;

  const getData = (): AuthUser | null => user.value;

  return { add, remove, getData, isAuthenticated };
});
