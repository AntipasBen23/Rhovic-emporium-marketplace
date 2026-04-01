const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://rhovic-emporium-backend-production.up.railway.app";

let refreshPromise: Promise<boolean> | null = null;
let csrfBootstrapPromise: Promise<void> | null = null;

function getCSRFCookie() {
  if (typeof document === "undefined") return "";
  const cookie = document.cookie
    .split("; ")
    .find((part) => part.startsWith("rhovic_csrf_token="));
  return cookie ? decodeURIComponent(cookie.slice("rhovic_csrf_token=".length)) : "";
}

async function ensureCSRFToken(): Promise<void> {
  if (getCSRFCookie()) return;
  if (!csrfBootstrapPromise) {
    csrfBootstrapPromise = fetch(`${API_URL}/auth/csrf`, {
      method: "GET",
      credentials: "include",
    })
      .then(() => undefined)
      .catch(() => undefined)
      .finally(() => {
        csrfBootstrapPromise = null;
      });
  }
  await csrfBootstrapPromise;
}

async function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    const csrf = getCSRFCookie();
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(csrf ? { "X-CSRF-Token": csrf } : {}),
      },
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

function looksInternalDetails(value: string) {
  const text = value.toLowerCase();
  return (
    text.includes("sqlstate") ||
    text.includes("duplicate key") ||
    text.includes("constraint") ||
    text.includes("violates unique") ||
    text.includes("syntax error") ||
    text.includes("pq:") ||
    text.includes("pg:")
  );
}

function humanizeError(status: number, message: string, details: string) {
  const safeDetails = details && !looksInternalDetails(details) ? details : "";

  if (status === 409 && message.toLowerCase().includes("account already exists")) {
    return "An account with this email already exists. Log in or verify your email to continue.";
  }
  if (status === 503 && message.toLowerCase().includes("verification email unavailable")) {
    return "Your account was created, but we could not send the verification code right now. Please try resending the code shortly.";
  }
  if (message.toLowerCase().includes("email verification required")) {
    return "Please verify your email with the code we sent before logging in.";
  }
  if (status >= 500) {
    return "Something went wrong on our side. Please try again shortly.";
  }
  if (safeDetails) {
    return `${message}: ${safeDetails}`;
  }
  return message;
}

async function request<T>(path: string, options: RequestInit = {}, hasRetried = false, csrfRetried = false): Promise<T> {
  const headers = new Headers(options.headers);
  const method = (options.method || "GET").toUpperCase();
  if (["POST", "PATCH", "PUT", "DELETE"].includes(method)) {
    await ensureCSRFToken();
  }
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (["POST", "PATCH", "PUT", "DELETE"].includes(method)) {
    const csrf = getCSRFCookie();
    if (csrf && !headers.has("X-CSRF-Token")) {
      headers.set("X-CSRF-Token", csrf);
    }
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
      return request<T>(path, options, true, csrfRetried);
    }
    clearPersistedAuth();
  }

  const canRetryCSRF =
    !csrfRetried &&
    response.status === 403 &&
    ["POST", "PATCH", "PUT", "DELETE"].includes(method) &&
    !path.startsWith("/auth/login") &&
    !path.startsWith("/auth/refresh") &&
    !path.startsWith("/auth/logout");

  if (canRetryCSRF) {
    csrfBootstrapPromise = null;
    await ensureCSRFToken();
    return request<T>(path, options, hasRetried, true);
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({} as Record<string, unknown>));
    const message =
      (typeof errorBody.message === "string" && errorBody.message) ||
      (typeof errorBody.error === "string" && errorBody.error) ||
      `Request failed with status ${response.status}`;
    const details = typeof errorBody.details === "string" ? errorBody.details : "";
    throw new Error(humanizeError(response.status, message, details));
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
