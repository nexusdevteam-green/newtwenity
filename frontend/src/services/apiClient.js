import { getStoredSession, setStoredSession, clearStoredSession } from "./session";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

class ApiError extends Error {}

async function parseResponse(response) {
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data.error || "Error de red");
  }
  return data;
}

async function tryRefresh() {
  const session = getStoredSession();
  if (!session?.refresh_token) return null;

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  const refreshed = { ...data.session, user: data.user };
  setStoredSession(refreshed);
  return refreshed;
}

/**
 * Llama a la API del backend. Adjunta el access token si `auth` es true (por defecto)
 * y reintenta una vez tras refrescar la sesión si recibe un 401.
 */
export async function apiFetch(path, { method = "GET", body, auth = true, isRetry = false } = {}) {
  const session = auth ? getStoredSession() : null;
  const headers = { "Content-Type": "application/json" };
  if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && auth && !isRetry) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return apiFetch(path, { method, body, auth, isRetry: true });
    }
    clearStoredSession();
  }

  return parseResponse(response);
}

/**
 * Sube un archivo (multipart/form-data) a la API.
 */
export async function apiUpload(path, file) {
  const session = getStoredSession();
  const headers = {};
  if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  return parseResponse(response);
}
