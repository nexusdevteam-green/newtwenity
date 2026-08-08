import { apiFetch } from "./apiClient";
import { getStoredSession, setStoredSession, clearStoredSession, subscribeToSession } from "./session";

/**
 * Registra un usuario nuevo con email, contraseña y display_name.
 * El perfil se crea automáticamente en profiles mediante un trigger en la BD.
 */
export async function signUp({ email, password, displayName }) {
  const data = await apiFetch("/auth/register", {
    method: "POST",
    body: { name: displayName, email, password },
    auth: false,
  });

  if (data.session) {
    setStoredSession({ ...data.session, user: data.user });
  }
  return data;
}

/**
 * Inicia sesión con email y contraseña.
 */
export async function signIn({ email, password }) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });

  setStoredSession({ ...data.session, user: data.user });
  return data;
}

/**
 * Cierra la sesión del usuario actual.
 */
export async function signOut() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } finally {
    clearStoredSession();
  }
}

/**
 * Obtiene la sesión almacenada localmente.
 */
export async function getSession() {
  return getStoredSession();
}

/**
 * Obtiene el usuario actual, validando la sesión contra el backend.
 */
export async function getCurrentUser() {
  const session = getStoredSession();
  if (!session) return null;

  try {
    const data = await apiFetch("/auth/me");
    return data.user;
  } catch {
    clearStoredSession();
    return null;
  }
}

/**
 * Escucha cambios en el estado de autenticación (login/logout).
 * Retorna una función para desuscribirse.
 */
export function onAuthStateChange(callback) {
  return subscribeToSession(callback);
}

/**
 * Solicita un email de recuperación de contraseña.
 */
export async function requestPasswordReset(email) {
  return apiFetch("/auth/forgot-password", {
    method: "POST",
    body: { email },
    auth: false,
  });
}

/**
 * Confirma una nueva contraseña usando el token recibido por email.
 */
export async function confirmPasswordReset({ accessToken, refreshToken, password }) {
  return apiFetch("/auth/reset-password", {
    method: "POST",
    body: { access_token: accessToken, refresh_token: refreshToken, password },
    auth: false,
  });
}
