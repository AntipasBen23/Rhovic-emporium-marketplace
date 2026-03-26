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

export default function SessionManager() {
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<number | null>(null);

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
