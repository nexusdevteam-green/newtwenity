import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Header from "../Header"
import { useAuth } from "../../context/AuthContext"
import { usePosts } from "../../context/PostsContext"
import ProfileInfo from "./ProfileInfo"
import ProfileFeed from "./ProfileFeed"
import ProfileFriends from "./ProfileFriends"
import HiddenPostsPanel from "./HiddenPostsPanel"
import { getProfile } from "../../services/profiles"
import { getHiddenPosts } from "../../services/posts"

function ProfilePage() {
  const { id } = useParams()
  const { profile: ownProfile } = useAuth()
  const { posts, deletePost, hidePost, unhidePost, toggleLike, addComment } = usePosts()
  const [profileUser, setProfileUser] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [hiddenPosts, setHiddenPosts] = useState([])
  const [showHiddenPanel, setShowHiddenPanel] = useState(false)

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

  useEffect(() => {
    if (!isOwnProfile) return
    let mounted = true

    getHiddenPosts(id)
      .then((data) => {
        if (mounted) setHiddenPosts(data)
      })
      .catch((err) => console.error("Error cargando posts ocultos:", err))

    return () => {
      mounted = false
    }
  }, [id, isOwnProfile])

  const profilePosts = posts.filter((post) => post.user_id === id)
  const postsWithHandlers = profilePosts.map((post) => ({
    ...post,
    onToggleLike: toggleLike,
    onAddComment: addComment,
  }))

  const handleHide = async (postId) => {
    const post = profilePosts.find((p) => p.id === postId)
    try {
      await hidePost(postId)
      if (post) setHiddenPosts((current) => [{ ...post, is_hidden: true }, ...current])
    } catch (err) {
      console.error("Error ocultando post:", err)
    }
  }

  const handleUnhide = async (post) => {
    try {
      await unhidePost(post)
      setHiddenPosts((current) => current.filter((p) => p.id !== post.id))
    } catch (err) {
      console.error("Error mostrando post:", err)
    }
  }

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
      <Header
        hiddenPostsCount={hiddenPosts.length}
        onOpenHiddenPosts={() => setShowHiddenPanel(true)}
      />
      <main className="main profile">
        <ProfileInfo user={profileUser} isOwnProfile={isOwnProfile} />

        <ProfileFeed
          posts={postsWithHandlers}
          isOwnProfile={isOwnProfile}
          onDelete={deletePost}
          onHide={handleHide}
        />

        <ProfileFriends />
      </main>

      {showHiddenPanel && (
        <HiddenPostsPanel
          posts={hiddenPosts}
          onUnhide={handleUnhide}
          onClose={() => setShowHiddenPanel(false)}
        />
      )}
    </>
  )
}

export default ProfilePage
