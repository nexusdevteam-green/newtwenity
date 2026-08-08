import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import Button from "../Button"
import { requestPasswordReset } from "../../services/auth"
import { validateForgotPasswordForm } from "../../utils/validators"

function ForgotPasswordForm() {
  const location = useLocation()

  const [email, setEmail] = useState(location.state?.email || "")
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (event) => {
    setEmail(event.target.value)
    setFormError("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError("")

    const validationErrors = validateForgotPasswordForm({ email })
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      await requestPasswordReset(email)
      setSent(true)
    } catch (err) {
      setFormError(err.message || "No se ha podido enviar el email de recuperación.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <div className="auth-card__tape" />
        <h1 className="auth-card__title">Recupera tu contraseña</h1>
        <p className="auth-card__sub">
          Escribe tu email y te enviaremos un enlace para elegir una contraseña nueva.
        </p>

        {sent ? (
          <p className="auth-success">
            Si el email existe, te hemos enviado un enlace para restablecer tu contraseña.
            Revisa tu bandeja de entrada.
          </p>
        ) : (
          <>
            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={handleChange}
                placeholder="tucorreo@ejemplo.com"
                autoComplete="email"
              />
              {errors.email && <small className="auth-error">{errors.email}</small>}
            </label>

            {formError && <p className="auth-error auth-error--form">{formError}</p>}

            <Button type="submit" variant="primary" className="auth-submit" disabled={submitting}>
              {submitting ? "Enviando..." : "Enviar enlace"}
            </Button>
          </>
        )}

        <p className="auth-switch">
          <Link to="/login">Volver a iniciar sesión</Link>
        </p>
      </form>
    </div>
  )
}

export default ForgotPasswordForm
