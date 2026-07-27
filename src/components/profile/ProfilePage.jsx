import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Header from "../Header"
import { useAuth } from "../../context/AuthContext"
import { usePosts } from "../../context/PostsContext"
import ProfileInfo from "./ProfileInfo"
import ProfileFeed from "./ProfileFeed"
import ProfileFriends from "./ProfileFriends"
import { getProfile } from "../../services/profiles"

function ProfilePage() {
  const { id } = useParams()
  const { profile: ownProfile } = useAuth()
  const { posts, deletePost, toggleLike, addComment } = usePosts()
  const [profileUser, setProfileUser] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  const isOwnProfile = ownProfile && id === ownProfile.id

  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      if (isOwnProfile) {
        setProfileUser(ownProfile)
        setLoadingProfile(false)
        return
      }

      try {
        setLoadingProfile(true)
        const data = await getProfile(id)
        if (mounted) setProfileUser(data)
      } catch (err) {
        console.error("Error cargando perfil:", err)
        if (mounted) setProfileUser(null)
      } finally {
        if (mounted) setLoadingProfile(false)
      }
    }

    loadProfile()

    return () => {
      mounted = false
    }
  }, [id, isOwnProfile, ownProfile])

  const profilePosts = posts.filter((post) => post.user_id === id)
  const postsWithHandlers = profilePosts.map((post) => ({
    ...post,
    onToggleLike: toggleLike,
    onAddComment: addComment,
  }))

  if (loadingProfile) {
    return (
      <>
        <Header />
        <main className="main">
          <p className="profile-feed__empty">Cargando perfil...</p>
        </main>
      </>
    )
  }

  if (!profileUser) {
    return (
      <>
        <Header />
        <main className="main">
          <p className="profile-feed__empty">No se ha encontrado este perfil.</p>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="main profile">
        <ProfileInfo user={profileUser} isOwnProfile={isOwnProfile} />

        <ProfileFeed
          posts={postsWithHandlers}
          isOwnProfile={isOwnProfile}
          onDelete={deletePost}
        />

        <ProfileFriends />
      </main>
    </>
  )
}

export default ProfilePage
