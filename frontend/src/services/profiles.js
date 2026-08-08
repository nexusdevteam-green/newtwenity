import { apiFetch } from "./apiClient";

/**
 * Obtiene el perfil de un usuario por su ID.
 */
export async function getProfile(userId) {
  return apiFetch(`/profiles/${userId}`, { auth: false });
}

/**
 * Obtiene el perfil del usuario actual.
 */
export async function getMyProfile() {
  return apiFetch("/profiles/me");
}

/**
 * Obtiene el perfil del usuario autenticado y, si no existe (por ejemplo
 * porque el trigger handle_new_user no llegó a crearlo), el backend lo
 * crea como respaldo.
 */
export async function ensureProfile() {
  return apiFetch("/profiles/me");
}

/**
 * Actualiza el perfil del usuario actual.
 */
export async function updateProfile(updates) {
  return apiFetch("/profiles/me", { method: "PUT", body: updates });
}

/**
 * Busca un perfil por username.
 */
export async function getProfileByUsername(username) {
  return apiFetch(`/profiles/username/${username}`, { auth: false });
}
