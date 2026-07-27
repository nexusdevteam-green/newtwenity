import { useState, useRef } from "react"
import Button from "../Button"
import { useAuth } from "../../context/AuthContext"
import { usePosts } from "../../context/PostsContext"
import { uploadPostImage } from "../../services/storage"

function Composer() {
  const [text, setText] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)
  const { profile } = useAuth()
  const { addPost } = usePosts()

  const canPublish = Boolean(text.trim() || imageFile) && !uploading

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowed.includes(file.type)) {
      setError("Solo se permiten imágenes JPG, PNG, WebP o GIF.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar 5MB.")
      return
    }

    setError("")
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImageFile(null)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handlePublish = async () => {
    if (!canPublish) return
    setError("")
    setUploading(true)

    try {
      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadPostImage(imageFile)
      }

      await addPost({ content: text.trim(), imageUrl })
      setText("")
      removeImage()
    } catch (err) {
      setError(err.message || "Error al publicar.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="composer">
      <div className="composer__tape" />

      <div className="composer__bubble">
        <div
          className="composer__avatar"
          style={{ backgroundImage: `url('${profile?.avatar_url || ""}')` }}
        />
        <textarea
          className="composer__input"
          placeholder="¿Qué novedad hay?"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
          disabled={uploading}
        />
      </div>

      {imagePreview && (
        <div className="composer__preview">
          <img src={imagePreview} alt="Vista previa" className="composer__preview-img" />
          <button
            type="button"
            className="composer__preview-remove"
            onClick={removeImage}
            disabled={uploading}
          >
            ✕
          </button>
        </div>
      )}

      {error && <p className="auth-error auth-error--form">{error}</p>}

      <div className="composer__toolbar">
        <div className="composer__options">
          <button
            type="button"
            className="composer__option"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            📷 Añadir foto
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        <Button
          variant="primary"
          className="composer__submit"
          disabled={!canPublish}
          onClick={handlePublish}
        >
          {uploading ? "Subiendo..." : "Publicar"}
        </Button>
      </div>
    </div>
  )
}

export default Composer
