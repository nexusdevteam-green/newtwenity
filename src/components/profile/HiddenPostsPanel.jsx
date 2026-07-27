import Button from "../Button"

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
                  style={{ backgroundImage: `url('${post.avatar}')` }}
                />
                <div className="hidden-post__info">
                  <p className="hidden-post__name">{post.name}</p>
                  <p className="hidden-post__text">{post.text}</p>
                </div>
                <Button baseClass="post__manage-btn" onClick={() => onUnhide(post.id)}>
                  Desocultar
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default HiddenPostsPanel
