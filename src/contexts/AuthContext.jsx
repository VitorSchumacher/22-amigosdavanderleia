import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('guiar_token')
    if (!token) { setLoading(false); return }
    try {
      const res = await api.get('/auth/me')
      setUser(res.data)
    } catch {
      localStorage.removeItem('guiar_token')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadUser() }, [loadUser])

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('guiar_token', res.token)
    setUser(res.user)
    return res
  }

  async function register(payload) {
    const res = await api.post('/auth/register', payload)
    localStorage.setItem('guiar_token', res.token)
    setUser(res.user)
    return res
  }

  async function updateUser(slug, payload) {
    const res = await api.put(`/users/${slug}`, payload)
    setUser(res.data)
    return res
  }

  function logout() {
    localStorage.removeItem('guiar_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
