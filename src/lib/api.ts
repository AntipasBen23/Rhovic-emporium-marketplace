const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://rhovic-emporium-backend-production.up.railway.app";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("rhovic_token") : null;
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

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
    request<T>(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: any, options?: RequestInit) => 
    request<T>(path, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string, options?: RequestInit) => 
    request<T>(path, { ...options, method: "DELETE" }),
};
