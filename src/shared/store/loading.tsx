import {create} from "zustand";

type LoadingState = {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
};

export const useLoadingAppStore = create<LoadingState>(set => ({
  isLoading: true,
  setLoading: value => set({isLoading: value}),
}));
