import React, { createContext, useContext } from "react"
import { useState } from "react"
import { faker } from "@faker-js/faker"

const PostContext = createContext() // * Move the context definition outside the component

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  }
}

function PostProvider({ children }) {
  const [posts, setPosts] = useState(
    Array.from({ length: 30 }, (_, i) => i + 1).map(() => createRandomPost())
  )

  const [searchQuery, setSearchQuery] = useState("")

  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts

  function handleAddPost(post) {
    setPosts((posts) => [...posts, post])
  }

  function handleClearPosts() {
    setPosts([])
  }

  return (
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
        searchQuery: searchQuery,
        setSearchQuery: setSearchQuery,
      }}
    >
      {children}
    </PostContext.Provider>
  )
}

// * our own custom hook
function usePost() {
  const context = useContext(PostProvider)
  if (typeof context === "undefined")
    throw new Error(" the context is outside of the PostProvider ")
  return context
}

export { PostProvider, PostContext, usePost }
