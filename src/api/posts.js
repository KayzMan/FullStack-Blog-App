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

export const createPost = async (token, post) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  })
  return await res.json()
}

export const deletePost = async (token, postId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return res.status
}

export const updatePost = async (token, postId, { title, contents, tags }) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, contents, tags }),
    },
  )

  return await res.json()
}
