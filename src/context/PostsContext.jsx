import { createContext, useContext, useState } from "react"
import postsData from "../data/posts"

const PostsContext = createContext(null)

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState(postsData)
  const [hiddenPosts, setHiddenPosts] = useState([])

  const addPost = (post) => {
    setPosts((current) => [post, ...current])
  }

  const deletePost = (id) => {
    setPosts((current) => current.filter((post) => post.id !== id))
    setHiddenPosts((current) => current.filter((post) => post.id !== id))
  }

  const hidePost = (id) => {
    const post = posts.find((item) => item.id === id)
    if (!post) return
    setPosts((current) => current.filter((item) => item.id !== id))
    setHiddenPosts((current) => [...current, post])
  }

  const unhidePost = (id) => {
    const post = hiddenPosts.find((item) => item.id === id)
    if (!post) return
    setHiddenPosts((current) => current.filter((item) => item.id !== id))
    setPosts((current) => [...current, post])
  }

  return (
    <PostsContext.Provider
      value={{ posts, hiddenPosts, addPost, deletePost, hidePost, unhidePost }}
    >
      {children}
    </PostsContext.Provider>
  )
}

export function usePosts() {
  const context = useContext(PostsContext)
  if (!context) throw new Error("usePosts debe usarse dentro de un PostsProvider")
  return context
}
