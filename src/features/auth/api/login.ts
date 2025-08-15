import {authRequest} from "@/src/shared/api";
import {AuthPayload, AuthResponse} from "../model";

export const login = async (payload: AuthPayload): Promise<AuthResponse> => {
  return authRequest("/api/users/login", payload);
};
