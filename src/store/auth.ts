import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    token: string | null;
    role: string | null;
    setAuth: (token: string, role: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            role: null,
            setAuth: (token, role) => {
                if (typeof window !== "undefined") {
                    localStorage.setItem("rhovic_token", token);
                }
                set({ token, role });
            },
            logout: () => {
                if (typeof window !== "undefined") {
                    localStorage.removeItem("rhovic_token");
                }
                set({ token: null, role: null });
            },
        }),
        {
            name: "rhovic-auth",
        }
    )
);
