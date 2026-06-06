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

  if (!res.ok) {
    let message = 'Erro inesperado'
    let errors = null
    try {
      const data = await res.json()
      message = data.message ?? message
      errors = data.errors ?? null
    } catch {}
    const error = new Error(message)
    error.status = res.status
    error.errors = errors
    throw error
  }

  return res.json()
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
  resendOtp: () => api.post('/whatsapp/resend-otp', {}),
}

export const financeiro = {
  listar: (slug, params) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get(`/users/${slug}/financeiro/lancamentos${qs}`)
  },
  criar: (slug, body) => api.post(`/users/${slug}/financeiro/lancamentos`, body),
  remover: (slug, id) => api.delete(`/users/${slug}/financeiro/lancamentos/${id}`),
  resumo: (slug) => api.get(`/users/${slug}/financeiro/resumo`),
  evolucao: (slug) => api.get(`/users/${slug}/financeiro/evolucao`),
  categorias: (slug) => api.get(`/users/${slug}/financeiro/categorias`),
}

export const notasFiscais = {
  listar: (slug) => api.get(`/users/${slug}/notas-fiscais`),
  emitir: (slug, body) => api.post(`/users/${slug}/notas-fiscais`, body),
}

export const sefaz = {
  listar: (slug) => api.get(`/users/${slug}/sefaz/nfe-recebidas`),
  sincronizar: (slug) => api.post(`/users/${slug}/sefaz/sincronizar`, {}),
}

export const commodities = {
  listar: () => api.get('/commodities'),
}

export const estoque = {
  listar: (slug, params) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get(`/users/${slug}/estoque${qs}`)
  },
  criar: (slug, body) => api.post(`/users/${slug}/estoque`, body),
  resumo: (slug) => api.get(`/users/${slug}/estoque/resumo`),
  alertas: (slug) => api.get(`/users/${slug}/estoque/alertas`),
  movimentacoes: (slug, params) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get(`/users/${slug}/estoque/movimentacoes${qs}`)
  },
  buscar: (slug, id) => api.get(`/users/${slug}/estoque/${id}`),
  atualizar: (slug, id, body) => api.put(`/users/${slug}/estoque/${id}`, body),
  remover: (slug, id) => api.delete(`/users/${slug}/estoque/${id}`),
  movimentar: (slug, id, body) => api.post(`/users/${slug}/estoque/${id}/movimentar`, body),
}
