import Axios, { InternalAxiosRequestConfig } from "axios";

import { API_URL } from "@/config";
import { useToast } from "vue-toast-notification";
import { LoginResponse } from "@/features/auth";
export const axios = Axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const refreshAccessTokenFn = async () => {
  const response = await axios.get<LoginResponse>("auth/refresh");
  return response.data;
};

axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // set token
  config.headers["Accept"] = "application/json";
  config.headers["Content-Type"] = "application/json";

  return config;
});

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Check if token expired and try refreshing

    useToast().error("Failed to execute the request!", { position: "top" });

    return Promise.reject(error);
  },
);
