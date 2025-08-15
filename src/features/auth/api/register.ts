import {authRequest} from "@/src/shared/api";
import {AuthPayload, AuthResponse} from "../model";

export const register = async (payload: AuthPayload): Promise<AuthResponse> => {
  return authRequest("/api/users/register", payload);
};
