import { Router } from "express";
import { supabaseAnon, supabaseForToken } from "../lib/supabaseClient.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son obligatorios." });
  }

  const { data, error } = await supabaseAnon.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: name, name },
    },
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ user: data.user, session: data.session });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son obligatorios." });
  }

  const { data, error } = await supabaseAnon.auth.signInWithPassword({ email, password });

  if (error) return res.status(401).json({ error: error.message });
  res.json({ user: data.user, session: data.session });
});

router.post("/logout", async (_req, res) => {
  // Sesión sin estado en el backend: el frontend descarta el token local.
  // (revocar el refresh token en Supabase requeriría la service role key)
  res.status(204).end();
});

router.post("/refresh", async (req, res) => {
  const { refresh_token: refreshToken } = req.body || {};
  if (!refreshToken) {
    return res.status(400).json({ error: "Falta el refresh_token." });
  }

  const { data, error } = await supabaseAnon.auth.refreshSession({ refresh_token: refreshToken });
  if (error) return res.status(401).json({ error: error.message });
  res.json({ user: data.user, session: data.session });
});

router.get("/me", requireAuth, async (req, res) => {
  const { data: profile, error } = await req.supabase
    .from("profiles")
    .select("*")
    .eq("id", req.user.id)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ user: req.user, profile });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body || {};
  if (email) {
    const redirectTo = `${process.env.FRONTEND_URL}/restablecer-password`;
    await supabaseAnon.auth.resetPasswordForEmail(email, { redirectTo }).catch(() => {});
  }
  // Respuesta genérica siempre, para no revelar si el email existe.
  res.json({
    message: "Si el email existe, te hemos enviado un enlace para restablecer tu contraseña.",
  });
});

router.post("/reset-password", async (req, res) => {
  const { access_token: accessToken, refresh_token: refreshToken, password } = req.body || {};
  if (!accessToken || !refreshToken || !password) {
    return res.status(400).json({ error: "Faltan datos para restablecer la contraseña." });
  }

  const client = supabaseForToken(accessToken);
  const { error: sessionError } = await client.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (sessionError) return res.status(400).json({ error: sessionError.message });

  const { error } = await client.auth.updateUser({ password });
  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Contraseña actualizada correctamente." });
});

export default router;
