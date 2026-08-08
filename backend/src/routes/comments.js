import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.delete("/:id", requireAuth, async (req, res) => {
  const { error } = await req.supabase.from("comments").delete().eq("id", req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

export default router;
