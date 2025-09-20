export const signup = async ({ username, password }) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  const data = await res.json()

  if (!res.ok) throw new Error(data?.error || 'failed to sign up!')
  return data
}

export const login = async ({ username, password }) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  const data = await res.json()

  if (!res.ok) throw new Error(data?.error || 'failed to sign up!')
  return data
}

export const getUserInfo = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return await res.json()
}
