import { apiFetch } from "./apiClient";

/**
 * Crea un nuevo post.
 */
export async function createPost({ content, imageUrl = null }) {
  return apiFetch("/posts", {
    method: "POST",
    body: { content, imageUrl },
  });
}

/**
 * Obtiene el feed global de posts (ordenados por fecha descendente).
 * Incluye: perfil del autor, número de likes, comentarios, y si el usuario actual dio like.
 */
export async function getFeed({ page = 0, pageSize = 20 } = {}) {
  return apiFetch(`/posts?page=${page}&pageSize=${pageSize}`);
}

/**
 * Obtiene los posts de un usuario específico.
 */
export async function getUserPosts(userId, { page = 0, pageSize = 20 } = {}) {
  return apiFetch(`/posts/user/${userId}?page=${page}&pageSize=${pageSize}`);
}

/**
 * Elimina un post. Solo funciona si el usuario es el propietario (gracias a RLS).
 */
export async function deletePost(postId) {
  await apiFetch(`/posts/${postId}`, { method: "DELETE" });
}

/**
 * Da o quita "me gusta" a un post. Retorna true si ha quedado con like.
 */
export async function toggleLike(postId) {
  const { liked } = await apiFetch(`/posts/${postId}/like`, { method: "POST" });
  return liked;
}

/**
 * Añade un comentario a un post.
 */
export async function addComment(postId, content) {
  return apiFetch(`/posts/${postId}/comments`, {
    method: "POST",
    body: { content },
  });
}

/**
 * Elimina un comentario. Solo funciona si el usuario es el propietario.
 */
export async function deleteComment(commentId) {
  await apiFetch(`/comments/${commentId}`, { method: "DELETE" });
}
