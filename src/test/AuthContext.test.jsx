import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

vi.mock('../services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}))

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

function TestConsumer() {
  const { user, loading } = useAuth()
  if (loading) return <span>loading</span>
  return <span>{user ? user.name : 'sem-usuario'}</span>
}

describe('AuthProvider', () => {
  it('começa sem usuário quando não há token', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )
    await waitFor(() => expect(screen.getByText('sem-usuario')).toBeInTheDocument())
  })

  it('carrega usuário do token existente no localStorage', async () => {
    localStorage.setItem('guiar_token', 'tok')
    api.get.mockResolvedValue({ data: { name: 'João' } })

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await waitFor(() => expect(screen.getByText('João')).toBeInTheDocument())
  })

  it('remove token quando /auth/me falha', async () => {
    localStorage.setItem('guiar_token', 'tok-invalido')
    api.get.mockRejectedValue(new Error('Unauthorized'))

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('sem-usuario')).toBeInTheDocument()
      expect(localStorage.getItem('guiar_token')).toBeNull()
    })
  })
})

function LoginConsumer() {
  const { user, login, logout } = useAuth()
  return (
    <div>
      <span>{user ? user.name : 'sem-usuario'}</span>
      <button onClick={() => login('a@b.com', '123')}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  )
}

describe('login e logout', () => {
  it('login salva token e define usuário', async () => {
    api.get.mockResolvedValue(null)
    api.post.mockResolvedValue({ token: 'novo-tok', user: { name: 'Maria' } })

    render(
      <AuthProvider>
        <LoginConsumer />
      </AuthProvider>
    )

    await waitFor(() => expect(screen.getByText('sem-usuario')).toBeInTheDocument())

    await act(async () => {
      screen.getByText('login').click()
    })

    await waitFor(() => {
      expect(screen.getByText('Maria')).toBeInTheDocument()
      expect(localStorage.getItem('guiar_token')).toBe('novo-tok')
    })
  })

  it('logout remove token e limpa usuário', async () => {
    localStorage.setItem('guiar_token', 'tok')
    api.get.mockResolvedValue({ data: { name: 'João' } })

    render(
      <AuthProvider>
        <LoginConsumer />
      </AuthProvider>
    )

    await waitFor(() => expect(screen.getByText('João')).toBeInTheDocument())

    await act(async () => {
      screen.getByText('logout').click()
    })

    expect(screen.getByText('sem-usuario')).toBeInTheDocument()
    expect(localStorage.getItem('guiar_token')).toBeNull()
  })
})

describe('useAuth fora do provider', () => {
  it('lança erro descritivo', () => {
    const originalError = console.error
    console.error = vi.fn()

    function Orphan() {
      useAuth()
      return null
    }

    expect(() => render(<Orphan />)).toThrow('useAuth deve ser usado dentro de AuthProvider')

    console.error = originalError
  })
})
