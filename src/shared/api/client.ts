import {enqueueSnackbar} from "notistack";
import axios from "axios";

export const apiClient = async (
  url: string,
  method: string,
  data: object | FormData = {},
  token?: string
): Promise<any> => {
  const bearer =
    token || (typeof window !== "undefined" ? localStorage.getItem("token") : "");

  const isFormData = data instanceof FormData;

  return axios
    .request({
      url,
      method,
      data,
      baseURL: "http://oai.factfactor.ru",
      headers: {
        Accept: isFormData ? "multipart/form-data" : "application/json",
        ...(isFormData ? {} : {"Content-Type": "application/json"}),
        Authorization: bearer ? `Bearer ${bearer}` : "",
      },
    })
    .then(({status, data}) => {
      if ([200, 201, 204].includes(status)) return data;

      enqueueSnackbar(data?.message || "Что-то пошло не так", {variant: "error"});
    })
    .catch(err => {
      if (err?.status === 401) {
        enqueueSnackbar(err?.data?.message || "Не авторизован", {variant: "error"});
        return err;
      }

      enqueueSnackbar(err.response?.data?.error || "Что-то пошло не так", {
        variant: "error",
      });
      return err;
    });
};
