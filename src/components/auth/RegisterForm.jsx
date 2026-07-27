import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Button from "../Button"
import { useAuth } from "../../context/AuthContext"
import { validateRegisterForm } from "../../utils/validators"

function RegisterForm() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState("")

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setFormError("")

    const validationErrors = validateRegisterForm(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const result = register(form)
    if (!result.ok) {
      setFormError(result.error)
      return
    }

    navigate("/", { replace: true })
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

        <Button type="submit" variant="primary" className="auth-submit">
          Crear cuenta
        </Button>

        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterForm
