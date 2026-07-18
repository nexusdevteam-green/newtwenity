import { useState } from "react"
import Button from "../Button"

function Composer() {
  const [text, setText] = useState("")

  return (
    <div className="composer">
      <div className="composer__tape" />

      <div className="composer__bubble">
        <div
          className="composer__avatar"
          style={{ backgroundImage: "url('https://i.pravatar.cc/80?img=12')" }}
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
          <button type="button" className="composer__option">
            📷 Añadir foto
          </button>
          <button type="button" className="composer__option">
            🏷️ Etiquetar amigos
          </button>
          <button type="button" className="composer__option">
            🎵 Poner música
          </button>
        </div>

        <Button variant="primary" className="composer__submit" disabled={!text.trim()}>
          Publicar
        </Button>
      </div>
    </div>
  )
}

export default Composer
