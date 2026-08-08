function HiddenPostsPanel({ posts, onUnhide, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal__head">
          <h3 className="modal__title">Posts ocultos</h3>
          <button type="button" className="modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        {posts.length === 0 ? (
          <p className="profile-feed__empty">No tienes publicaciones ocultas.</p>
        ) : (
          <ul className="hidden-posts-list">
            {posts.map((post) => (
              <li key={post.id} className="hidden-post">
                <div
                  className="hidden-post__avatar"
                  style={{
                    backgroundImage: `url('${post.profiles?.avatar_url || ""}')`,
                  }}
                />
                <div className="hidden-post__info">
                  <p className="hidden-post__name">
                    {post.profiles?.display_name || "Anónimo"}
                  </p>
                  <p className="hidden-post__text">{post.content}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default HiddenPostsPanel
