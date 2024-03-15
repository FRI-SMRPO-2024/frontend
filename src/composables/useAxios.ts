import { ref } from "vue";
import { AxiosResponse } from "axios";
import { axios } from "@/lib";
import { ApiError } from "@/types";
import { API_URL } from "@/config";

type AxiosProps = {
  method: "get" | "post" | "delete" | "put";
  url: string;
};

export const useAxios = <T>({ method, url }: AxiosProps) => {
  const isLoading = ref<boolean>(false);
  const error = ref<ApiError>({ status: 0, message: "" });
  const isError = ref<boolean>(false);

  const execute = async (body: object = {}): Promise<T> => {
    isLoading.value = true;

    return axios({ method, url: API_URL + url, data: body })
      .then((res: AxiosResponse<T>) => {
        return Promise.resolve(res.data);
      })
      .catch((err: ApiError) => {
        error.value = err;
        isError.value = true;
        return Promise.reject(err);
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  return { execute, isLoading, isError, error };
};
