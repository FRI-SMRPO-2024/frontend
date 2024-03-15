import { LoginResponse } from "@/features/auth";
import { useUserStore } from "@/stores/user.store";
import storage from "@/utils/storage";
import { useToast } from "vue-toast-notification";

const handleLogout = () => {
  storage.clear("token");
  storage.clear("refresh_token");

  useUserStore().remove();
};

const handleSuccessAuth = (data: LoginResponse) => {
  const { access_token, refresh_token, user } = data;

  useUserStore().add(user);

  storage.set("token", access_token);
  storage.set("refresh_token", refresh_token);

  useToast().success(`Welcome ${user.username}`, { position: "top" });
};

export { handleSuccessAuth, handleLogout };
