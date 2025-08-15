import {apiClient} from "@/src/shared/api";
import {User} from "../model";

interface CurrentUserResponse {
  data: User;
}

export const getUserByToken = (
  token: string
): Promise<CurrentUserResponse | undefined> => {
  return apiClient("/users/getByToken", "get", {}, token);
};
