import { useState } from "react"
import { Link } from "react-router-dom"
import Button from "../Button"
import { useAuth } from "../../context/AuthContext"

function Post({ post, isOwner = false, onDelete, onHide }) {
  const {
    id,
    profiles,
    content,
    image_url,
    created_at,
    likes_count = 0,
    user_liked = false,
    comments_count = 0,
    comments = [],
  } = post

  const { profile } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const displayName = profiles?.display_name || "Anónimo"
  const avatarUrl = profiles?.avatar_url || ""
  const username = profiles?.username || ""

  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMin = Math.floor(diffMs / 60000)
    const diffH = Math.floor(diffMin / 60)
    const diffD = Math.floor(diffH / 24)

    if (diffMin < 1) return "Justo ahora"
    if (diffMin < 60) return `hace ${diffMin} min`
    if (diffH < 24) return `hace ${diffH} h`
    if (diffD < 7) return `hace ${diffD} días`
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
  }

  return (
    <article className={`post${image_url ? " post--photo" : ""}`}>
      <div className="post__tape" />

      <header className="post__head">
        <Link to={`/perfil/${profiles?.id || ""}`} className="post__avatar-link">
          <div
            className="post__avatar"
            style={{ backgroundImage: `url('${avatarUrl}')` }}
          />
        </Link>
        <div className="post__head-info">
          <Link to={`/perfil/${profiles?.id || ""}`} className="post__name">
            {displayName}
          </Link>
          <p className="post__time">{formatTime(created_at)}</p>
        </div>
        {isOwner && (
          <div className="post__manage">
            <Button
              baseClass="post__manage-btn"
              onClick={() => onHide?.(id)}
            >
              Ocultar
            </Button>
            <Button
              baseClass="post__manage-btn"
              onClick={() => onDelete?.(id)}
            >
              Borrar
            </Button>
          </div>
        )}
      </header>

      {image_url && (
        <div className="post__photo">
          <img src={image_url} alt="Publicación" className="post__photo-img" />
        </div>
      )}

      {content && <p className="post__text">{content}</p>}

      <footer className="post__footer">
        <Button
          baseClass={`post__action${user_liked ? " post__action--liked" : ""}`}
          onClick={() => post.onToggleLike?.(id)}
        >
          {user_liked ? "❤️" : "🤍"} Me gusta ({likes_count})
        </Button>
        <Button
          baseClass="post__action"
          onClick={() => setShowComments((v) => !v)}
        >
          💬 Comentar ({comments_count})
        </Button>
      </footer>

      {showComments && (
        <div className="post__comments-section">
          {comments.length > 0 && (
            <ul className="post__comments">
              {comments.map((comment) => (
                <li key={comment.id} className="post__comment">
                  <span
                    className="post__comment-avatar"
                    style={{
                      backgroundImage: `url('${comment.profiles?.avatar_url || ""}')`,
                    }}
                  />
                  <p>
                    <Link
                      to={`/perfil/${comment.user_id}`}
                      className="post__comment-name"
                    >
                      {comment.profiles?.display_name || "Anónimo"}
                    </Link>{" "}
                    {comment.content}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <form
            className="post__comment-form"
            onSubmit={async (e) => {
              e.preventDefault()
              if (!commentText.trim() || submitting) return
              setSubmitting(true)
              try {
                await post.onAddComment?.(id, commentText.trim())
                setCommentText("")
              } catch (err) {
                console.error("Error al comentar:", err)
              } finally {
                setSubmitting(false)
              }
            }}
          >
            <input
              type="text"
              className="post__comment-input"
              placeholder="Escribe un comentario..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={submitting}
            />
            <Button
              type="submit"
              baseClass="post__comment-submit"
              disabled={!commentText.trim() || submitting}
            >
              Enviar
            </Button>
          </form>
        </div>
      )}
    </article>
  )
}

export default Post
