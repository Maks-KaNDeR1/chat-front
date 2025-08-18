import {apiClient} from "@/src/shared/api";
import {User} from "../model";

interface CurrentUserResponse {
  result: User;
}

export const getUserByToken = (
  token: string
): Promise<CurrentUserResponse | undefined> => {
  return apiClient("api/users/getByToken", "get");
};
