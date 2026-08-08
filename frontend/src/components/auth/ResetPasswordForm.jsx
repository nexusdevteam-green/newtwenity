import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Button from "../Button"
import { confirmPasswordReset } from "../../services/auth"
import { validateResetPasswordForm } from "../../utils/validators"

function readRecoveryTokens() {
  const raw = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.search.slice(1)
  const params = new URLSearchParams(raw)
  return {
    accessToken: params.get("access_token"),
    refreshToken: params.get("refresh_token"),
  }
}

function ResetPasswordForm() {
  const navigate = useNavigate()
  const [tokens] = useState(readRecoveryTokens)

  const [form, setForm] = useState({ password: "", confirmPassword: "" })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setFormError("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError("")

    if (!tokens.accessToken || !tokens.refreshToken) {
      setFormError("El enlace de recuperación no es válido o ha caducado.")
      return
    }

    const validationErrors = validateResetPasswordForm(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      await confirmPasswordReset({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        password: form.password,
      })
      navigate("/login", {
        replace: true,
        state: { message: "Contraseña actualizada. Ya puedes iniciar sesión." },
      })
    } catch (err) {
      setFormError(err.message || "No se ha podido actualizar la contraseña.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <div className="auth-card__tape" />
        <h1 className="auth-card__title">Elige una nueva contraseña</h1>
        <p className="auth-card__sub">Escribe tu nueva contraseña para tu cuenta.</p>

        {!tokens.accessToken && (
          <p className="auth-error auth-error--form">
            El enlace de recuperación no es válido o ha caducado.
          </p>
        )}

        <label className="auth-field">
          <span>Nueva contraseña</span>
          <input
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
          />
          {errors.password && <small className="auth-error">{errors.password}</small>}
        </label>

        <label className="auth-field">
          <span>Repite la contraseña</span>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <small className="auth-error">{errors.confirmPassword}</small>
          )}
        </label>

        {formError && <p className="auth-error auth-error--form">{formError}</p>}

        <Button type="submit" variant="primary" className="auth-submit" disabled={submitting}>
          {submitting ? "Guardando..." : "Guardar contraseña"}
        </Button>

        <p className="auth-switch">
          <Link to="/login">Volver a iniciar sesión</Link>
        </p>
      </form>
    </div>
  )
}

export default ResetPasswordForm
