export const getPosts = async (queryParams) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts?` +
      new URLSearchParams(queryParams),
  )
  return await res.json()
}

export const getSinglePost = async (postId) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`)
  return await res.json()
}

export const createPost = async (post) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  })
  return await res.json()
}

export const deletePost = async (postId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`,
    {
      method: 'DELETE',
    },
  )
  return res.status
}

export const updatePost = async (postId, { title, author, contents, tags }) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, author, contents, tags }),
    },
  )

  return await res.json()
}
