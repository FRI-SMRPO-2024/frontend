import { axios } from "@/lib";
import { AuthUser, LoginFormData, LoginResponse } from "@/features/auth";
import { useMutation } from "@tanstack/vue-query";
import { useUserStore } from "@/stores/user.store";
import storage from "@/utils/storage";
import { useToast } from "vue-toast-notification";

const loginFn = (data: LoginFormData): Promise<LoginResponse> => {
  return axios.post("auth/login", data);
};

const logoutFn = () => {
  return axios.post("auth/logout", {
    access_token: storage.get("access_token"),
  });
};

const handleSuccessAuth = (data: LoginResponse) => {
  const { email, access_token, refresh_token } = data;

  const authUser: AuthUser = {
    id: 0,
    email: email,
    username: "testing",
    firstName: "test",
    lastName: "tester",
    role: "Admin",
  };

  useUserStore().add(authUser);

  storage.set("token", access_token);
  storage.set("refresh_token", refresh_token);

  useToast().success(`Welcome ${authUser.username}`, { position: "top" });
};

const useAuthenticate = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginFormData) => loginFn(data),
    onError: (error) => {
      return error.response.data;
    },
  });
};

const useLogout = () => {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: () => logoutFn(),
  });
};

export { loginFn, useAuthenticate, useLogout, handleSuccessAuth };
