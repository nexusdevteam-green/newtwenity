import { supabase } from "./supabase";

/**
 * Crea un nuevo post.
 */
export async function createPost({ content, imageUrl = null }) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("No hay usuario autenticado");

  const { data, error } = await supabase
    .from("posts")
    .insert({ user_id: user.id, content, image_url: imageUrl })
    .select(
      `
      *,
      profiles:user_id (id, username, display_name, avatar_url)
    `
    )
    .single();

  if (error) throw error;
  return data;
}

/**
 * Obtiene el feed global de posts (ordenados por fecha descendente).
 * Incluye: perfil del autor, número de likes, comentarios, y si el usuario actual dio like.
 */
export async function getFeed({ page = 0, pageSize = 20 } = {}) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles:user_id (id, username, display_name, avatar_url),
      likes (id, user_id),
      comments (id, user_id, content, created_at, profiles:user_id (id, username, display_name, avatar_url))
    `
    )
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return data.map((post) => ({
    ...post,
    likes_count: post.likes?.length ?? 0,
    comments_count: post.comments?.length ?? 0,
    user_liked: user ? post.likes?.some((l) => l.user_id === user.id) : false,
  }));
}

/**
 * Obtiene los posts de un usuario específico.
 */
export async function getUserPosts(userId, { page = 0, pageSize = 20 } = {}) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles:user_id (id, username, display_name, avatar_url),
      likes (id, user_id),
      comments (id, user_id, content, created_at, profiles:user_id (id, username, display_name, avatar_url))
    `
    )
    .eq("user_id", userId)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return data.map((post) => ({
    ...post,
    likes_count: post.likes?.length ?? 0,
    comments_count: post.comments?.length ?? 0,
    user_liked: user ? post.likes?.some((l) => l.user_id === user.id) : false,
  }));
}

/**
 * Elimina un post. Solo funciona si el usuario es el propietario (gracias a RLS).
 */
export async function deletePost(postId) {
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw error;
}

/**
 * Oculta o muestra de nuevo un post propio (no lo borra).
 */
export async function setPostHidden(postId, isHidden) {
  const { error } = await supabase
    .from("posts")
    .update({ is_hidden: isHidden })
    .eq("id", postId);
  if (error) throw error;
}

/**
 * Obtiene los posts ocultos de un usuario (solo visibles para su propio autor).
 */
export async function getHiddenPosts(userId) {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles:user_id (id, username, display_name, avatar_url)
    `
    )
    .eq("user_id", userId)
    .eq("is_hidden", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Da "me gusta" a un post.
 */
export async function toggleLike(postId) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("No hay usuario autenticado");

  // Verificar si ya tiene like
  const { data: existing } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .maybeSingle();

  if (existing) {
    // Quitar like
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("id", existing.id);
    if (error) throw error;
    return false;
  } else {
    // Dar like
    const { error } = await supabase
      .from("likes")
      .insert({ user_id: user.id, post_id: postId });
    if (error) throw error;
    return true;
  }
}

/**
 * Añade un comentario a un post.
 */
export async function addComment(postId, content) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("No hay usuario autenticado");

  const { data, error } = await supabase
    .from("comments")
    .insert({ user_id: user.id, post_id: postId, content })
    .select(
      `
      *,
      profiles:user_id (id, username, display_name, avatar_url)
    `
    )
    .single();

  if (error) throw error;
  return data;
}

/**
 * Elimina un comentario. Solo funciona si el usuario es el propietario.
 */
export async function deleteComment(commentId) {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);
  if (error) throw error;
}

/**
 * Suscribe a cambios en tiempo real en la tabla posts.
 * Retorna una función para desuscribirse.
 */
export function subscribeToPosts(callback) {
  const channel = supabase
    .channel("posts-changes")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "posts" },
      (payload) => callback({ type: "INSERT", post: payload.new })
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "posts" },
      (payload) => callback({ type: "DELETE", post: payload.old })
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

/**
 * Suscribe a cambios en tiempo real en la tabla likes.
 */
export function subscribeToLikes(callback) {
  const channel = supabase
    .channel("likes-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "likes" },
      (payload) => callback(payload)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

/**
 * Suscribe a cambios en tiempo real en la tabla comments.
 */
export function subscribeToComments(callback) {
  const channel = supabase
    .channel("comments-changes")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "comments" },
      (payload) => callback({ type: "INSERT", comment: payload.new })
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "comments" },
      (payload) => callback({ type: "DELETE", comment: payload.old })
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
