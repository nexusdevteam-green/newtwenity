import { Router } from "express";
import { supabaseAnon } from "../lib/supabaseClient.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const POST_SELECT = `
  *,
  profiles:user_id (id, username, display_name, avatar_url),
  likes (id, user_id),
  comments (id, user_id, content, created_at, profiles:user_id (id, username, display_name, avatar_url))
`;

function enrichPosts(posts, userId) {
  return posts.map((post) => ({
    ...post,
    likes_count: post.likes?.length ?? 0,
    comments_count: post.comments?.length ?? 0,
    user_liked: userId ? post.likes?.some((l) => l.user_id === userId) : false,
  }));
}

function pageRange(page, pageSize) {
  const from = page * pageSize;
  const to = from + pageSize - 1;
  return { from, to };
}

router.get("/", async (req, res) => {
  const page = Number(req.query.page) || 0;
  const pageSize = Number(req.query.pageSize) || 20;
  const { from, to } = pageRange(page, pageSize);

  const client = req.supabase || supabaseAnon;
  const { data, error } = await client
    .from("posts")
    .select(POST_SELECT)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return res.status(400).json({ error: error.message });
  res.json(enrichPosts(data, req.user?.id));
});

router.get("/hidden", requireAuth, async (req, res) => {
  const { data, error } = await req.supabase
    .from("posts")
    .select(
      `
      *,
      profiles:user_id (id, username, display_name, avatar_url)
    `
    )
    .eq("user_id", req.user.id)
    .eq("is_hidden", true)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.get("/user/:userId", async (req, res) => {
  const page = Number(req.query.page) || 0;
  const pageSize = Number(req.query.pageSize) || 20;
  const { from, to } = pageRange(page, pageSize);

  const client = req.supabase || supabaseAnon;
  const { data, error } = await client
    .from("posts")
    .select(POST_SELECT)
    .eq("user_id", req.params.userId)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return res.status(400).json({ error: error.message });
  res.json(enrichPosts(data, req.user?.id));
});

router.patch("/:id/hidden", requireAuth, async (req, res) => {
  const { isHidden } = req.body || {};

  const { data, error } = await req.supabase
    .from("posts")
    .update({ is_hidden: Boolean(isHidden) })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.post("/", requireAuth, async (req, res) => {
  const { content, imageUrl = null } = req.body || {};

  const { data, error } = await req.supabase
    .from("posts")
    .insert({ user_id: req.user.id, content, image_url: imageUrl })
    .select(
      `
      *,
      profiles:user_id (id, username, display_name, avatar_url)
    `
    )
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const { error } = await req.supabase.from("posts").delete().eq("id", req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

router.post("/:id/like", requireAuth, async (req, res) => {
  const postId = req.params.id;
  const { data: existing } = await req.supabase
    .from("likes")
    .select("id")
    .eq("user_id", req.user.id)
    .eq("post_id", postId)
    .maybeSingle();

  if (existing) {
    const { error } = await req.supabase.from("likes").delete().eq("id", existing.id);
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ liked: false });
  }

  const { error } = await req.supabase
    .from("likes")
    .insert({ user_id: req.user.id, post_id: postId });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ liked: true });
});

router.post("/:id/comments", requireAuth, async (req, res) => {
  const { content } = req.body || {};

  const { data, error } = await req.supabase
    .from("comments")
    .insert({ user_id: req.user.id, post_id: req.params.id, content })
    .select(
      `
      *,
      profiles:user_id (id, username, display_name, avatar_url)
    `
    )
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

export default router;
