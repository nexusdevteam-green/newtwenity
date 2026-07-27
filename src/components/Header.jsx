import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Nav from "./Nav"
import { useAuth } from "../context/AuthContext"
import useClickOutside from "../hooks/useClickOutside"

function Header({ hiddenPostsCount = 0, onOpenHiddenPosts }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const isOwnProfilePage = location.pathname === `/perfil/${user.id}`
  const settingsRef = useClickOutside(settingsOpen, () => setSettingsOpen(false))

  const handleLogout = () => {
    setSettingsOpen(false)
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="logo">
          <span className="logo__mark">t.</span>
          <span className="logo__text">Tuenties</span>
        </Link>

        <Nav />

        <div className="navbar__search">
          <input type="text" placeholder="Busca amigos..." />
        </div>

        <div className="navbar__user">
          <span className="navbar__bell" title="Notificaciones">
            🔔<span className="badge">3</span>
          </span>

          {isOwnProfilePage && (
            <div className="navbar__settings-wrap" ref={settingsRef}>
              <button
                type="button"
                className="navbar__settings"
                title="Configuración"
                onClick={() => setSettingsOpen((open) => !open)}
              >
                ⚙️
              </button>
              {settingsOpen && (
                <ul className="navbar__settings-menu">
                  <li>Editar perfil</li>
                  <li>Privacidad</li>
                  <li
                    onClick={() => {
                      setSettingsOpen(false)
                      onOpenHiddenPosts?.()
                    }}
                  >
                    Posts ocultos{hiddenPostsCount > 0 ? ` ( ${hiddenPostsCount} )` : ""}
                  </li>
                  <li onClick={handleLogout}>Cerrar sesión</li>
                </ul>
              )}
            </div>
          )}

          <Link to={`/perfil/${user.id}`}>
            <div
              className="navbar__avatar"
              style={{ backgroundImage: `url('${user.avatar}')` }}
            />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
