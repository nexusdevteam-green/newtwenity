import { Routes, Route, useParams } from 'react-router-dom'
import Dashboard from './components/dashboard/Dashboard'
import ProfilePage from './components/profile/ProfilePage'
import Footer from './components/Footer'
import { PostsProvider } from './context/PostsContext'

function ProfileRoute() {
  const { id } = useParams()
  // remonta la página al cambiar de perfil, para no arrastrar estado (amigos) del perfil anterior
  return <ProfilePage key={id} />
}

function App() {
  return (
    <PostsProvider>
      <div className="app-shell">
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/perfil/:id" element={<ProfileRoute />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </PostsProvider>
  )
}

export default App
