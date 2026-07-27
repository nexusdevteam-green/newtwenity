import { useState } from "react"
import Button from "../Button"
import { useAuth } from "../../context/AuthContext"
import { usePosts } from "../../context/PostsContext"

function Composer() {
  const [text, setText] = useState("")
  const [photo] = useState(null) // subida de fotos: pendiente hasta tener API/almacenamiento
  const { user } = useAuth()
  const { addPost } = usePosts()

  const canPublish = Boolean(text.trim() || photo)

  const handlePublish = () => {
    if (!canPublish) return

    addPost({
      id: Date.now(),
      authorId: user.id,
      avatar: user.avatar,
      name: user.name,
      time: "Justo ahora",
      text: text.trim(),
      photo,
      tapeVariant: null,
      pinned: false,
      likes: 0,
      music: null,
      comments: [],
    })

    setText("")
  }

  return (
    <div className="composer">
      <div className="composer__tape" />

      <div className="composer__bubble">
        <div
          className="composer__avatar"
          style={{ backgroundImage: `url('${user.avatar}')` }}
        />
        <textarea
          className="composer__input"
          placeholder="¿Qué novedad hay?"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
        />
      </div>

      <div className="composer__toolbar">
        <div className="composer__options">
          <button
            type="button"
            className="composer__option"
            disabled
            title="Próximamente"
          >
            📷 Añadir foto
          </button>
          <button
            type="button"
            className="composer__option"
            disabled
            title="Próximamente"
          >
            🏷️ Etiquetar amigos
          </button>
          <button
            type="button"
            className="composer__option"
            disabled
            title="Próximamente"
          >
            🎵 Poner música
          </button>
        </div>

        <Button
          variant="primary"
          className="composer__submit"
          disabled={!canPublish}
          onClick={handlePublish}
        >
          Publicar
        </Button>
      </div>
    </div>
  )
}

export default Composer
