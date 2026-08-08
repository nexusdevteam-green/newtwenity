import { Router } from "express";
import { supabaseAnon } from "../lib/supabaseClient.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const { data, error } = await req.supabase
    .from("profiles")
    .select("*")
    .eq("id", req.user.id)
    .single();

  if (!error) return res.json(data);

  // El trigger handle_new_user no llegó a crear el perfil: lo creamos ahora
  // como respaldo, usando la política RLS "profiles_insert_own".
  if (error.code !== "PGRST116") {
    return res.status(400).json({ error: error.message });
  }

  const user = req.user;
  const rawName =
    user.user_metadata?.display_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "usuario";
  const cleanUsername =
    rawName.toLowerCase().replace(/[^a-z0-9]/g, "") || user.id.slice(0, 8);
  const username = `${cleanUsername}${user.id.slice(0, 4)}`;

  const { data: created, error: createError } = await req.supabase
    .from("profiles")
    .insert({
      id: user.id,
      username,
      display_name: rawName,
      avatar_url: `https://i.pravatar.cc/300?u=${user.email}`,
    })
    .select()
    .single();

  if (createError) return res.status(400).json({ error: createError.message });
  res.json(created);
});

router.put("/me", requireAuth, async (req, res) => {
  const updates = req.body || {};
  const { data, error } = await req.supabase
    .from("profiles")
    .update(updates)
    .eq("id", req.user.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.get("/username/:username", async (req, res) => {
  const { data, error } = await supabaseAnon
    .from("profiles")
    .select("*")
    .eq("username", req.params.username)
    .single();

  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

router.get("/:id", async (req, res) => {
  const { data, error } = await supabaseAnon
    .from("profiles")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

export default router;
