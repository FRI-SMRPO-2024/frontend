import Axios, { InternalAxiosRequestConfig } from "axios";

import { API_URL } from "@/config";
import { useToast } from "vue-toast-notification";
import { LoginResponse } from "@/features/auth";
// import { ApiError } from "@/types";
export const axios = Axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const refreshAccessTokenFn = async () => {
  const response = await axios.get<LoginResponse>("auth/refresh");
  return response.data;
};

axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers["Accept"] = "application/json";
  config.headers["Content-Type"] = "application/json";

  return config;
});

axios.interceptors.response.use(
  (response) => {
    console.log("response", response);
    return response;
  },
  (error) => {
    console.log("error", error);
    const apiError = {
      // status: error.response.status,
      message: error.response.data,
    };

    if (apiError.message.message === "Invalid login credentials") {
      return Promise.reject(apiError);
    }

    useToast().error("There was an issue with the request", {
      position: "top",
    });
    return Promise.reject(apiError);
  },
);
