import storage from "@/utils/storage";
import { AuthUser, LoginResponse } from "@/features/auth";
import { useUserStore } from "@/stores/user.store";
import { useAxios } from "@/composables/useAxios";

export const useAuth = () => {
  const accessToken = storage.get("token");
  const refreshToken = storage.get("refresh_token");

  const hasTokens = (): boolean => {
    return !!accessToken || !!refreshToken;
  };

  const getMe = (): Promise<AuthUser | LoginResponse> => {
    let body = {};
    let url = "";

    if (!accessToken) {
      body = {
        refresh_token: refreshToken,
      };
      url = "auth/refresh-token";
    } else {
      body = {
        email: useUserStore().decodeToken().email,
      };
      url = "user/get";
    }

    const { execute } = useAxios<AuthUser | LoginResponse>({
      method: "post",
      url,
    });
    return execute(body);
  };

  return { hasTokens, getMe };
};
