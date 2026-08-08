import { supabaseForToken } from "../lib/supabaseClient.js";

function extractToken(req) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
}

/**
 * Si hay un token válido en la cabecera Authorization, adjunta req.user y
 * req.supabase (cliente con el contexto de ese usuario). Si no hay token,
 * continúa sin usuario (para rutas de lectura pública).
 */
export async function attachUser(req, _res, next) {
  const token = extractToken(req);
  if (!token) return next();

  try {
    const client = supabaseForToken(token);
    const {
      data: { user },
      error,
    } = await client.auth.getUser(token);

    if (!error && user) {
      req.user = user;
      req.token = token;
      req.supabase = client;
    }
  } catch {
    // token inválido: seguimos sin usuario
  }

  next();
}

/**
 * Exige un usuario autenticado. Debe usarse después de attachUser.
 */
export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "No autenticado" });
  }
  next();
}
