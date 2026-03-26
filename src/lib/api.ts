const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://rhovic-emporium-backend-production.up.railway.app";

let refreshPromise: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

function clearPersistedAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("rhovic-auth");
  window.dispatchEvent(new Event("rhovic-auth-logout"));
}

async function request<T>(path: string, options: RequestInit = {}, hasRetried = false): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const canRefresh =
    !hasRetried &&
    response.status === 401 &&
    !path.startsWith("/auth/login") &&
    !path.startsWith("/auth/refresh") &&
    !path.startsWith("/auth/logout");

  if (canRefresh) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return request<T>(path, options, true);
    }
    clearPersistedAuth();
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({} as Record<string, unknown>));
    const message =
      (typeof errorBody.message === "string" && errorBody.message) ||
      (typeof errorBody.error === "string" && errorBody.error) ||
      `Request failed with status ${response.status}`;
    const details =
      typeof errorBody.details === "string" && errorBody.details
        ? `: ${errorBody.details}`
        : "";
    throw new Error(`${message}${details}`);
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

export const api = {
  get: <T>(path: string, options?: RequestInit) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body: any, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: <T>(path: string, body: any, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: <T>(path: string, options?: RequestInit) => 
    request<T>(path, { ...options, method: "DELETE" }),
};
