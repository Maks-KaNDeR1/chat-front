import {create} from "zustand";

interface AuthStatusState {
  isAuthorized: boolean;
  setAuthorized: (value: boolean) => void;
}

export const useAuthStatus = create<AuthStatusState>(set => ({
  isAuthorized: false,
  setAuthorized: (value: boolean) => set({isAuthorized: value}),
}));
