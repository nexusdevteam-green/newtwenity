import { supabase } from "./supabase";

/**
 * Registra un usuario nuevo con email, contraseña y display_name.
 * El perfil se crea automáticamente en profiles mediante un trigger en la BD.
 */
export async function signUp({ email, password, displayName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName, name: displayName },
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Inicia sesión con email y contraseña.
 */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Cierra la sesión del usuario actual.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Obtiene la sesión actual del usuario.
 */
export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

/**
 * Obtiene el usuario actual de la sesión.
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Escucha cambios en el estado de autenticación (login/logout).
 * Retorna una función para desuscribirse.
 */
export function onAuthStateChange(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}
