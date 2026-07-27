export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function validateRegisterForm({ name, email, password, confirmPassword }) {
  const errors = {}

  if (!name.trim() || name.trim().length < 2) {
    errors.name = "Escribe tu nombre completo."
  }

  if (!email.trim()) {
    errors.email = "El email es obligatorio."
  } else if (!isValidEmail(email)) {
    errors.email = "Escribe un email válido."
  }

  if (password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres."
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = "Las contraseñas no coinciden."
  }

  return errors
}

export function validateLoginForm({ email, password }) {
  const errors = {}

  if (!email.trim()) {
    errors.email = "El email es obligatorio."
  } else if (!isValidEmail(email)) {
    errors.email = "Escribe un email válido."
  }

  if (!password) {
    errors.password = "La contraseña es obligatoria."
  }

  return errors
}
