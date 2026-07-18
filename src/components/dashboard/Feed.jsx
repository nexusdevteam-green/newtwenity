import posts from "../../data/posts"
import Post from "./Post"

function Feed() {
  return (
    <section className="feed">
      <h2 className="section-title">Lo que se cuentan tus amigos</h2>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </section>
  )
}

export default Feed
