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

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
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
