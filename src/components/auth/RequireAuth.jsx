import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p className="auth-card__sub">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default RequireAuth
