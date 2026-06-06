const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

function getToken() {
  return localStorage.getItem('guiar_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (res.status === 204) return null

  const data = await res.json()

  if (!res.ok) {
    const error = new Error(data.message ?? 'Erro inesperado')
    error.status = res.status
    error.errors = data.errors ?? null
    throw error
  }

  return data
}

export const api = {
  post: (path, body) =>
    request(path, { method: 'POST', body: JSON.stringify(body) }),

  get: (path) =>
    request(path, { method: 'GET' }),

  put: (path, body) =>
    request(path, { method: 'PUT', body: JSON.stringify(body) }),

  delete: (path) =>
    request(path, { method: 'DELETE' }),
}

export const whatsapp = {
  verifyOtp: (code) => api.post('/whatsapp/verify-otp', { code }),
}
