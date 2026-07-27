import { usePosts } from "../../context/PostsContext"
import Post from "./Post"

function Feed() {
  const { posts, loading, hasMore, loadMore, toggleLike, addComment } = usePosts()

  const postsWithHandlers = posts.map((post) => ({
    ...post,
    onToggleLike: toggleLike,
    onAddComment: addComment,
  }))

  return (
    <section className="feed">
      <h2 className="section-title">Lo que se cuentan tus amigos</h2>

      {loading && posts.length === 0 && (
        <p className="profile-feed__empty">Cargando publicaciones...</p>
      )}

      {!loading && posts.length === 0 && (
        <p className="profile-feed__empty">
          Todavía no hay publicaciones. ¡Sé el primero en publicar!
        </p>
      )}

      {postsWithHandlers.map((post) => (
        <Post key={post.id} post={post} />
      ))}

      {hasMore && !loading && posts.length > 0 && (
        <button
          type="button"
          className="feed__load-more"
          onClick={loadMore}
        >
          Cargar más
        </button>
      )}

      {loading && posts.length > 0 && (
        <p className="profile-feed__empty">Cargando más...</p>
      )}
    </section>
  )
}

export default Feed
