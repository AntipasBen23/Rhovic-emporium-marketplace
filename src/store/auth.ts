import { create } from "zustand";

interface AuthState {
  role: string | null;
  setRole: (role: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  role: null,
  setRole: (role) => set({ role }),
  logout: () => set({ role: null }),
}));
