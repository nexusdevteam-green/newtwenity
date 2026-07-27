import { useState } from "react"
import { Link } from "react-router-dom"
import Button from "../Button"
import { useAuth } from "../../context/AuthContext"
import { validateRegisterForm } from "../../utils/validators"

function RegisterForm() {
  const { register } = useAuth()

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState(null)

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError("")

    const validationErrors = validateRegisterForm(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    const result = await register(form)
    setSubmitting(false)

    if (!result.ok) {
      setFormError(result.error)
      return
    }

    setRegisteredEmail(form.email)
  }

  if (registeredEmail) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-card__tape" />
          <div className="auth-banner">
            <span className="auth-banner__icon">📬</span>
            <h1 className="auth-card__title">¡Revisa tu correo!</h1>
            <p className="auth-card__sub">
              Te hemos enviado un email de confirmación a <strong>{registeredEmail}</strong>.
              Ábrelo y haz clic en el enlace para activar tu cuenta antes de iniciar sesión.
            </p>
          </div>

          <p className="auth-switch">
            <Link to="/login">Ir a iniciar sesión</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <div className="auth-card__tape" />
        <h1 className="auth-card__title">Únete a Tuenties</h1>
        <p className="auth-card__sub">Crea tu cuenta para empezar a cotillear el muro.</p>

        <label className="auth-field">
          <span>Nombre</span>
          <input
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Tu nombre y apellido"
            autoComplete="name"
          />
          {errors.name && <small className="auth-error">{errors.name}</small>}
        </label>

        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="tucorreo@ejemplo.com"
            autoComplete="email"
          />
          {errors.email && <small className="auth-error">{errors.email}</small>}
        </label>

        <label className="auth-field">
          <span>Contraseña</span>
          <div className="auth-field__input-wrap">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange("password")}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="auth-field__toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              tabIndex={-1}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && <small className="auth-error">{errors.password}</small>}
        </label>

        <label className="auth-field">
          <span>Repite la contraseña</span>
          <div className="auth-field__input-wrap">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="auth-field__toggle"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              tabIndex={-1}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.confirmPassword && (
            <small className="auth-error">{errors.confirmPassword}</small>
          )}
        </label>

        {formError && <p className="auth-error auth-error--form">{formError}</p>}

        <Button type="submit" variant="primary" className="auth-submit" disabled={submitting}>
          {submitting ? "Creando cuenta..." : "Crear cuenta"}
        </Button>

        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterForm
