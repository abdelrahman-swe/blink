
import { create } from "zustand";

let timeout: NodeJS.Timeout;

interface LoadingState {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,

  startLoading: () => {
    clearTimeout(timeout);

    // delay to prevent flicker on fast navigation
    timeout = setTimeout(() => {
      set({ isLoading: true });
    }, 120);
  },

  stopLoading: () => {
    clearTimeout(timeout);
    set({ isLoading: false });
  },
}));