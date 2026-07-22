import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../Header'
import currentUser from '../../data/currentUser'
import friends from '../../data/friends'
import { usePosts } from '../../context/PostsContext'
import ProfileInfo from './ProfileInfo'
import ProfileFeed from './ProfileFeed'
import ProfileFriends from './ProfileFriends'
import HiddenPostsPanel from './HiddenPostsPanel'

function ProfilePage() {
  const { id } = useParams()
  const isOwnProfile = id === String(currentUser.id)
  const friend = friends.find((item) => String(item.id) === id)
  const profileUser = isOwnProfile ? currentUser : friend

  const { posts, hiddenPosts, deletePost, hidePost, unhidePost } = usePosts()
  const [hiddenPanelOpen, setHiddenPanelOpen] = useState(false)

  const profilePosts = posts.filter((post) => String(post.authorId) === id)
  const profileHiddenPosts = hiddenPosts.filter((post) => String(post.authorId) === id)

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
        hiddenPostsCount={profileHiddenPosts.length}
        onOpenHiddenPosts={() => setHiddenPanelOpen(true)}
      />
      <main className="main profile">
        <ProfileInfo user={profileUser} isOwnProfile={isOwnProfile} />

        <ProfileFeed
          posts={profilePosts}
          isOwnProfile={isOwnProfile}
          onDelete={deletePost}
          onHide={hidePost}
        />

        <ProfileFriends />
      </main>

      {hiddenPanelOpen && (
        <HiddenPostsPanel
          posts={profileHiddenPosts}
          onUnhide={unhidePost}
          onClose={() => setHiddenPanelOpen(false)}
        />
      )}
    </>
  )
}

export default ProfilePage
