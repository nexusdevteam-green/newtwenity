import Post from '../dashboard/Post'

function ProfileFeed({ posts, isOwnProfile, onDelete, onHide }) {
  const pinnedPost = posts.find((post) => post.pinned)
  const restPosts = posts.filter((post) => !post.pinned)

  return (
    <section className="feed profile-feed">
      <h2 className="section-title">Publicaciones</h2>

      {posts.length === 0 && <p className="profile-feed__empty">Todavía no hay publicaciones.</p>}

      {pinnedPost && (
        <Post post={pinnedPost} isOwner={isOwnProfile} onDelete={onDelete} onHide={onHide} />
      )}
      {restPosts.map((post) => (
        <Post key={post.id} post={post} isOwner={isOwnProfile} onDelete={onDelete} onHide={onHide} />
      ))}
    </section>
  )
}

export default ProfileFeed
