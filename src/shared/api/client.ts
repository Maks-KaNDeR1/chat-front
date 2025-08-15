import {enqueueSnackbar} from "notistack";
import axios from "axios";

export const apiClient = async (
  url: string,
  method: string,
  data: object = {},
  token?: string
): Promise<any> => {
  const bearer = token || (typeof window !== "undefined" ? localStorage.getItem("token") : "");

  return axios
    .request({
      url: url,
      method,
      data,
      baseURL: "http://oai.factfactor.ru",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: bearer ? `Bearer ${bearer}` : "",
      },
    })
    .then(({status, data}) => {
      if ([200, 201, 204].includes(status)) return data;

      console.log(status, data);
      enqueueSnackbar(data?.message || "Что-то пошло не так", {variant: "error"});
    })
    .catch(({response}) => {
      if (response?.status === 401) {
        // например, разлогиниваем пользователя
      }
      throw Error(JSON.stringify(response?.data || {}));
    });
};
