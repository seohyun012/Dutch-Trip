import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  userId: number | null;
  nickname: string | null;
  setAuth: (userId: number, nickname: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      userId: null,
      nickname: null,
      setAuth: (userId, nickname) => set({ userId, nickname }),
      clearAuth: () => set({ userId: null, nickname: null }),
    }),
    { name: "auth-store" }
  )
);