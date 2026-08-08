import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Faltan variables de entorno de Supabase. " +
      "Crea un archivo .env con SUPABASE_URL y SUPABASE_ANON_KEY."
  );
}

/**
 * Cliente anónimo, para operaciones públicas (lecturas permitidas por RLS a cualquiera).
 */
export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Crea un cliente que actúa en nombre del usuario dueño del access token,
 * de forma que las políticas RLS (auth.uid()) se apliquen correctamente.
 */
export function supabaseForToken(accessToken) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
