import {create} from "zustand";
import {User} from "@/src/entities/user";

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  token: null,
  isAuthorized: false,

  setUser: (user, token) =>
    set(() => ({
      user,
      token,
    })),
  logout: () =>
    set(() => ({
      user: null,
      token: null,
    })),
}));
