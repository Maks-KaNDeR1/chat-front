import {create} from "zustand";
import {User} from "@/src/entities/user";

interface AuthState {
  user: User | null;
  isAuthorized: boolean;
  setUser: (user: User) => void;
  setIsAuthorization: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthorized: false,

  setUser: user =>
    set(() => ({
      user,
      isAuthorized: true,
    })),
  setIsAuthorization: () =>
    set(() => ({
      isAuthorized: true,
    })),
  logout: () =>
    set(() => ({
      user: null,
      isAuthorized: false,
    })),
}));
