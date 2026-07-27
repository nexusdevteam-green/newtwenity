import Button from "../Button"

function Post({ post, isOwner = false, onDelete, onHide }) {
  const {
    id,
    avatar,
    name,
    time,
    text,
    photo,
    tapeVariant,
    pinned,
    likes,
    music,
    comments = [],
  } = post

  return (
    <article className={`post${photo ? " post--photo" : ""}${pinned ? " post--pinned" : ""}`}>
      <div className={`post__tape${tapeVariant ? ` post__tape--${tapeVariant}` : ""}`} />

      <header className="post__head">
        <div className="post__avatar" style={{ backgroundImage: `url('${avatar}')` }} />
        <div className="post__head-info">
          <p className="post__name">{name}</p>
          <p className="post__time">{time}</p>
        </div>
        {pinned && <span className="post__pin-flag">📌 Fijado</span>}
        {isOwner && (
          <div className="post__manage">
            <Button baseClass="post__manage-btn" onClick={() => onHide?.(id)}>
              Ocultar
            </Button>
            <Button baseClass="post__manage-btn" onClick={() => onDelete?.(id)}>
              Borrar
            </Button>
          </div>
        )}
      </header>

      {photo && <div className="post__photo" style={{ backgroundImage: `url('${photo}')` }} />}

      <p className="post__text">{text}</p>

      {music && (
        <p className="post__music">
          🎵 {music.title} — {music.artist}
        </p>
      )}

      <footer className="post__footer">
        <Button baseClass="post__action">❤️ Me gusta ({likes})</Button>
        <Button baseClass="post__action">💬 Comentar ({comments.length})</Button>
        <Button baseClass="post__action">↪ Compartir</Button>
      </footer>

      {comments.length > 0 && (
        <ul className="post__comments">
          {comments.map((comment) => (
            <li key={comment.id} className="post__comment">
              <span
                className="post__comment-avatar"
                style={{ backgroundImage: `url('${comment.avatar}')` }}
              />
              <p>
                <span className="post__comment-name">{comment.name}</span> {comment.text}
              </p>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export default Post
