import {AuthPayload, AuthResponse} from "@/src/features/auth";
import {apiClient} from "@/src/shared/api/client";
import {enqueueSnackbar} from "notistack";

export const authRequest = async (
  url: "/api/users/login" | "/api/users/register",
  payload: AuthPayload,
  token?: string
): Promise<AuthResponse> => {
  try {
    const data = await apiClient(url, "post", payload, token);

    if (data.success) {
      return data;
    } else {
      enqueueSnackbar(data.response?.data?.error || "Ошибка авторизации", {
        variant: "error",
      });
      return data;
    }
  } catch (error: any) {
    enqueueSnackbar(error.response?.data?.error || "Сервер недоступен", {
      variant: "error",
    });
    return {success: false, error: error?.error};
  }
};
