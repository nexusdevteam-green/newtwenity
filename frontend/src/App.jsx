import { Routes, Route, useParams } from 'react-router-dom'
import Dashboard from './components/dashboard/Dashboard'
import ProfilePage from './components/profile/ProfilePage'
import Footer from './components/Footer'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import ForgotPasswordForm from './components/auth/ForgotPasswordForm'
import ResetPasswordForm from './components/auth/ResetPasswordForm'
import RequireAuth from './components/auth/RequireAuth'
import { PostsProvider } from './context/PostsContext'
import { AuthProvider } from './context/AuthContext'

function ProfileRoute() {
  const { id } = useParams()
  // remonta la página al cambiar de perfil, para no arrastrar estado (amigos) del perfil anterior
  return <ProfilePage key={id} />
}

function App() {
  return (
    <AuthProvider>
      <PostsProvider>
        <div className="app-shell">
          <div className="app-content">
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/registro" element={<RegisterForm />} />
              <Route path="/recuperar" element={<ForgotPasswordForm />} />
              <Route path="/restablecer-password" element={<ResetPasswordForm />} />
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/perfil/:id"
                element={
                  <RequireAuth>
                    <ProfileRoute />
                  </RequireAuth>
                }
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </PostsProvider>
    </AuthProvider>
  )
}

export default App
