import { createContext, useContext, useState } from "react"
import currentUser from "../data/currentUser"

const AuthContext = createContext(null)

const USERS_KEY = "tuenties_users"
const SESSION_KEY = "tuenties_session"
const DEMO_PASSWORD = "tuenti2026"

// Sin backend: los "usuarios" viven en localStorage. La cuenta demo reutiliza
// los datos de currentUser para que los posts/amigos de ejemplo sigan encajando.
function loadInitialState() {
  let users
  try {
    const stored = JSON.parse(localStorage.getItem(USERS_KEY))
    users = Array.isArray(stored) && stored.length > 0 ? stored : null
  } catch {
    users = null
  }

  if (!users) {
    users = [{ ...currentUser, email: "jaime@tuenties.com", password: DEMO_PASSWORD }]
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }

  const sessionEmail = localStorage.getItem(SESSION_KEY)
  const user =
    users.find((item) => item.email.toLowerCase() === sessionEmail?.toLowerCase()) || null

  return { users, user }
}

export function AuthProvider({ children }) {
  const [state, setState] = useState(loadInitialState)

  const register = ({ name, email, password }) => {
    const cleanEmail = email.trim().toLowerCase()

    if (state.users.some((existing) => existing.email.toLowerCase() === cleanEmail)) {
      return { ok: false, error: "Ya existe una cuenta con ese email." }
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password,
      avatar: `https://i.pravatar.cc/300?u=${cleanEmail}`,
      birthday: "",
      studyOrWork: "",
      pet: "",
      hobbies: [],
    }

    const nextUsers = [...state.users, newUser]
    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers))
    localStorage.setItem(SESSION_KEY, newUser.email)
    setState({ users: nextUsers, user: newUser })
    return { ok: true }
  }

  const login = ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase()
    const found = state.users.find((existing) => existing.email.toLowerCase() === cleanEmail)

    if (!found || found.password !== password) {
      return { ok: false, error: "Email o contraseña incorrectos." }
    }

    localStorage.setItem(SESSION_KEY, found.email)
    setState((current) => ({ ...current, user: found }))
    return { ok: true }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setState((current) => ({ ...current, user: null }))
  }

  return (
    <AuthContext.Provider value={{ user: state.user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider")
  return context
}
