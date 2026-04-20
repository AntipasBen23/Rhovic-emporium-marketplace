"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

function isProtectedPath(pathname: string) {
  return (
    pathname.startsWith("/my-orders") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/vendor") ||
    pathname.startsWith("/support")
  );
}

function roleFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

export default function SessionManager() {
  const role = useAuthStore((state) => state.role);
  const setRole = useAuthStore((state) => state.setRole);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<number | null>(null);

  // Bootstrap session from backend on app load so role always comes from a live token.
  useEffect(() => {
    async function bootstrap() {
      try {
        const res = await api.post<{ access_token: string }>("/auth/refresh", {});
        const liveRole = roleFromToken(res.access_token);
        if (liveRole) {
          setRole(liveRole);
        }
      } catch {
        // No valid session — stay logged out.
      }
    }
    void bootstrap();
  }, [setRole]);

  useEffect(() => {
    function handleForcedLogout() {
      logout();
    }

    window.addEventListener("rhovic-auth-logout", handleForcedLogout);
    return () => {
      window.removeEventListener("rhovic-auth-logout", handleForcedLogout);
    };
  }, [logout]);

  useEffect(() => {
    if (!role) {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    async function expireSession() {
      try {
        await api.post("/auth/logout", {});
      } catch {}
      logout();
      if (isProtectedPath(pathname)) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
      }
    }

    function resetTimer() {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        void expireSession();
      }, IDLE_TIMEOUT_MS);
    }

    const events: Array<keyof WindowEventMap> = [
      "click",
      "keydown",
      "mousemove",
      "scroll",
      "touchstart",
    ];

    resetTimer();
    for (const event of events) {
      window.addEventListener(event, resetTimer, { passive: true });
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      for (const event of events) {
        window.removeEventListener(event, resetTimer);
      }
    };
  }, [logout, pathname, role, router]);

  return null;
}
