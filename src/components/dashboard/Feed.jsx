import { usePosts } from "../../context/PostsContext"
import Post from "./Post"

function Feed() {
  const { posts } = usePosts()

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
