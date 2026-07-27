import Post from "../dashboard/Post"

function ProfileFeed({ posts, isOwnProfile, onDelete }) {
  return (
    <section className="feed profile-feed">
      <h2 className="section-title">Publicaciones</h2>

      {posts.length === 0 && (
        <p className="profile-feed__empty">Todavía no hay publicaciones.</p>
      )}

      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          isOwner={isOwnProfile}
          onDelete={onDelete}
        />
      ))}
    </section>
  )
}

export default ProfileFeed
