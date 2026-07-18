import Button from '../Button'

function Post({ post }) {
  const { avatar, name, time, text, photo, tapeVariant, likes, comments } = post

  return (
    <article className={`post${photo ? ' post--photo' : ''}`}>
      <div className={`post__tape${tapeVariant ? ` post__tape--${tapeVariant}` : ''}`} />

      <header className="post__head">
        <div className="post__avatar" style={{ backgroundImage: `url('${avatar}')` }} />
        <div>
          <p className="post__name">{name}</p>
          <p className="post__time">{time}</p>
        </div>
      </header>

      {photo && <div className="post__photo" style={{ backgroundImage: `url('${photo}')` }} />}

      <p className="post__text">{text}</p>

      <footer className="post__footer">
        <Button baseClass="post__action">📌 Me pica ({likes})</Button>
        <Button baseClass="post__action">💬 Comentar ({comments})</Button>
        <Button baseClass="post__action">↪ Compartir</Button>
      </footer>
    </article>
  )
}

export default Post
