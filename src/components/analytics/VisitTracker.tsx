"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://rhovic-emporium-backend-production.up.railway.app";

export default function VisitTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedRef = useRef("");

  useEffect(() => {
    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    if (!path || lastTrackedRef.current === path) {
      return;
    }
    lastTrackedRef.current = path;

    const payload = JSON.stringify({
      path,
      referrer: typeof document !== "undefined" ? document.referrer : "",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    });

    void fetch(`${API_URL}/analytics/visits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
      credentials: "include",
    }).catch(() => {
      // Analytics should never interrupt the storefront.
    });
  }, [pathname, searchParams]);

  return null;
}
