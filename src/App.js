import { useContext, useEffect, useState } from "react"
import { faker } from "@faker-js/faker"
import { PostProvider, PostContext, usePost } from "./PostContext"

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  }
}

const fakePosts = createRandomPost()
console.log(fakePosts)

function App() {
  // const x = usePost()
  // console.log(x)

  const [isFakeDark, setIsFakeDark] = useState(false)

  // Whenever `isFakeDark` changes, we toggle the `fake-dark-mode` class on the HTML element (see in "Elements" dev tool).
  useEffect(
    function () {
      document.documentElement.classList.toggle("fake-dark-mode")
    },
    [isFakeDark]
  )

  return (
    // ! 2) provide a Provider that provide the values of the context
    // ! value contains all the data that we make it accessible to the child components
    <PostProvider>
      <section>
        <button
          onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
          className="btn-fake-dark-mode"
        >
          {isFakeDark ? "☀️" : "🌙"}
        </button>

        <Header
        // posts={searchedPosts}
        // onClearPosts={handleClearPosts}
        // searchQuery={searchQuery}
        // setSearchQuery={setSearchQuery}
        // ! 3) consuming the values
        />
        <Main />
        <Archive />
        <Footer />
      </section>
    </PostProvider>
  )
}

function Header() {
  // ! 3) consuming the values out provided by the provider
  // { posts, onClearPosts, searchQuery, setSearchQuery }
  // ! removing these props also

  // ! 4) using the useCONTExT HOOK : reading the values by passing the entire context object
  const { posts, onAddPost, onClearPosts } = useContext(PostContext)

  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>
      <div>
        <Results />
        <SearchPosts
        // searchQuery={searchQuery}
        // setSearchQuery={setSearchQuery}
        />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  )
}

function SearchPosts() {
  // ! 4) getting the values out of the Provider object (PostContext)
  const { searchQuery, setSearchQuery } = useContext(PostContext)

  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search posts..."
    />
  )
}

function Results() {
  // ! 4) getting the values out of the Provider object (PostContext)
  const { posts } = useContext(PostContext)

  return <p>🚀 {posts.length} atomic posts found</p>
}

function Main() {
  // ! 4) getting the values out of the Provider object (PostContext)
  const { onAddPost, posts } = useContext(PostContext)

  return (
    <main>
      <FormAddPost onAddPost={onAddPost} />
      <Posts posts={posts} />
    </main>
  )
}

function Posts() {
  return (
    <section>
      <List />
    </section>
  )
}

function FormAddPost() {
  // ! 4) getting the values out of the Provider object (PostContext)
  const { onAddPost } = useContext(PostContext)

  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  const handleSubmit = function (e) {
    e.preventDefault()
    if (!body || !title) return
    onAddPost({ title, body })
    setTitle("")
    setBody("")
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Post body"
      />
      <button>Add post</button>
    </form>
  )
}

function List() {
  // ! 4) getting the values out of the Provider object (PostContext)
  const { posts } = useContext(PostContext)

  return (
    <ul>
      {posts.map((post, i) => (
        <li key={i}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  )
}

function Archive() {
  // ! Here we don't need the setter function. We're only using state to store these posts because the callback function passed into useState (which generates the posts) is only called once, on the initial render. So we use this trick as an optimization technique, because if we just used a regular variable, these posts would be re-created on every render. We could also move the posts outside the components, but I wanted to show you this trick 😉

  // ! 4) getting the values out of the Provider object (PostContext)
  const { onAddPost } = useContext(PostContext)

  const [posts] = useState(() =>
    // 💥 WARNING: This might make your computer slow! Try a smaller `length` first
    Array.from({ length: 10000 }, () => createRandomPost())
  )

  const [showArchive, setShowArchive] = useState(false)

  return (
    <aside>
      <h2>Post archive</h2>
      <button onClick={() => setShowArchive((s) => !s)}>
        {showArchive ? "Hide archive posts" : "Show archive posts"}
      </button>

      {showArchive && (
        <ul>
          {posts.map((post, i) => (
            <li key={i}>
              <p>
                <strong>{post.title}:</strong> {post.body}
              </p>
              <button onClick={() => onAddPost(post)}>Add as new post</button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

function Footer() {
  return <footer>&copy; by The Atomic Blog ✌️</footer>
}

export default App
