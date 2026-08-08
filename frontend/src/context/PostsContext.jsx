import { createContext, useContext, useCallback, useEffect, useState } from "react";
import * as postsService from "../services/posts";
import { useAuth } from "./AuthContext";

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 0 : page;
      const data = await postsService.getFeed({ page: currentPage, pageSize: 20 });

      if (reset) {
        setPosts(data);
        setPage(1);
      } else {
        setPosts((current) => [...current, ...data]);
        setPage(currentPage + 1);
      }

      setHasMore(data.length === 20);
    } catch (err) {
      console.error("Error cargando posts:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Cargar posts iniciales
  useEffect(() => {
    if (user) {
      fetchPosts(true);
    }
  }, [user, fetchPosts]);

  // Sondeo periódico para reflejar cambios de otros usuarios (sin websockets):
  // trae la primera página y fusiona posts nuevos + contadores actualizados.
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const latest = await postsService.getFeed({ page: 0, pageSize: 20 });
        const latestById = new Map(latest.map((post) => [post.id, post]));

        setPosts((current) => {
          const currentIds = new Set(current.map((post) => post.id));
          const newOnes = latest.filter((post) => !currentIds.has(post.id));
          const updatedCurrent = current.map((post) => {
            const fresh = latestById.get(post.id);
            return fresh ? { ...post, ...fresh } : post;
          });
          return [...newOnes, ...updatedCurrent];
        });
      } catch (err) {
        console.error("Error actualizando el feed:", err);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [user]);

  const addPost = useCallback(async ({ content, imageUrl }) => {
    const newPost = await postsService.createPost({ content, imageUrl });
    const enriched = {
      ...newPost,
      likes_count: 0,
      comments_count: 0,
      user_liked: false,
      likes: [],
      comments: [],
    };
    setPosts((current) => [enriched, ...current]);
    return enriched;
  }, []);

  const deletePost = useCallback(async (postId) => {
    await postsService.deletePost(postId);
    setPosts((current) => current.filter((p) => p.id !== postId));
  }, []);

  const hidePost = useCallback(async (postId) => {
    await postsService.setPostHidden(postId, true);
    setPosts((current) => current.filter((p) => p.id !== postId));
  }, []);

  const unhidePost = useCallback(async (post) => {
    await postsService.setPostHidden(post.id, false);
    setPosts((current) => {
      if (current.some((p) => p.id === post.id)) return current;
      return [{ ...post, is_hidden: false }, ...current];
    });
  }, []);

  const toggleLike = useCallback(
    async (postId) => {
      const liked = await postsService.toggleLike(postId);
      setPosts((current) =>
        current.map((post) => {
          if (post.id !== postId) return post;
          return {
            ...post,
            likes_count: liked
              ? post.likes_count + 1
              : Math.max(0, post.likes_count - 1),
            user_liked: liked,
          };
        })
      );
      return liked;
    },
    []
  );

  const addComment = useCallback(async (postId, content) => {
    const comment = await postsService.addComment(postId, content);
    setPosts((current) =>
      current.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments_count: post.comments_count + 1,
          comments: [...(post.comments || []), comment],
        };
      })
    );
    return comment;
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPosts(false);
    }
  }, [loading, hasMore, fetchPosts]);

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading,
        hasMore,
        addPost,
        deletePost,
        hidePost,
        unhidePost,
        toggleLike,
        addComment,
        loadMore,
        refreshFeed: () => fetchPosts(true),
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context)
    throw new Error("usePosts debe usarse dentro de un PostsProvider");
  return context;
}
