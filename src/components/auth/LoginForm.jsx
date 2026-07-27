import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Button from "../Button"
import { useAuth } from "../../context/AuthContext"
import { validateLoginForm } from "../../utils/validators"

function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || "/"

  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError("")

    const validationErrors = validateLoginForm(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    const result = await login(form)
    setSubmitting(false)

    if (!result.ok) {
      setFormError(result.error)
      return
    }

    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <div className="auth-card__tape" />
        <h1 className="auth-card__title">Hola de nuevo</h1>
        <p className="auth-card__sub">Entra con tu cuenta para ver el muro.</p>

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
          <input
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {errors.password && <small className="auth-error">{errors.password}</small>}
        </label>

        {formError && <p className="auth-error auth-error--form">{formError}</p>}

        <Button type="submit" variant="primary" className="auth-submit" disabled={submitting}>
          {submitting ? "Entrando..." : "Entrar"}
        </Button>

        <p className="auth-switch">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </form>
    </div>
  )
}

export default LoginForm
