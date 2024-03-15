import { defineStore } from "pinia";
import { ref } from "vue";
import { AuthUser } from "@/features/auth";
import storage from "@/utils/storage";
import { jwtDecode } from "jwt-decode";
import { TokenPayload } from "@/types";

export const useUserStore = defineStore("user", () => {
  const user = ref<AuthUser | null>(null);

  const add = (authUser: AuthUser) => {
    user.value = authUser;
  };

  const remove = () => {
    user.value = null;
  };

  const isAuthenticated = (): boolean => {
    return !!user.value;
  };

  const decodeToken = (): TokenPayload => {
    return jwtDecode(storage.get("token") as string);
  };

  const getData = (): AuthUser | null => user.value;

  return { add, remove, getData, isAuthenticated, decodeToken };
});
