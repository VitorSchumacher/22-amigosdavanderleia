import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import Login from '../pages/Login'
import * as AuthModule from '../contexts/AuthContext'
import { theme } from '../styles/theme'

vi.mock('../assets/logo.png', () => ({ default: 'logo.png' }))
vi.mock('../assets/farm-bg.mp4', () => ({ default: 'farm-bg.mp4' }))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderLogin(loginFn = vi.fn()) {
  vi.spyOn(AuthModule, 'useAuth').mockReturnValue({ login: loginFn })
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </ThemeProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Login — renderização', () => {
  it('exibe campos de e-mail, senha e botão de entrar', () => {
    renderLogin()
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Sua senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('exibe link para cadastro', () => {
    renderLogin()
    expect(screen.getByRole('link', { name: /cadastre-se/i })).toBeInTheDocument()
  })
})

describe('Login — toggle de senha', () => {
  it('alterna visibilidade da senha ao clicar no ícone', async () => {
    const user = userEvent.setup()
    renderLogin()

    const passwordInput = screen.getByPlaceholderText('Sua senha')
    expect(passwordInput).toHaveAttribute('type', 'password')

    const toggleBtn = screen.getByRole('button', { name: '' })
    await user.click(toggleBtn)
    expect(passwordInput).toHaveAttribute('type', 'text')

    await user.click(toggleBtn)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})

describe('Login — submissão', () => {
  it('navega para /dashboard após login com sucesso', async () => {
    const user = userEvent.setup()
    const loginFn = vi.fn().mockResolvedValue({})
    renderLogin(loginFn)

    await user.type(screen.getByPlaceholderText('seu@email.com'), 'joao@fazenda.com')
    await user.type(screen.getByPlaceholderText('Sua senha'), 'senha123')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(loginFn).toHaveBeenCalledWith('joao@fazenda.com', 'senha123')
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('exibe mensagem de erro para credenciais inválidas (401)', async () => {
    const user = userEvent.setup()
    const err = Object.assign(new Error('Unauthorized'), { status: 401 })
    const loginFn = vi.fn().mockRejectedValue(err)
    renderLogin(loginFn)

    await user.type(screen.getByPlaceholderText('seu@email.com'), 'errado@x.com')
    await user.type(screen.getByPlaceholderText('Sua senha'), 'errada')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(screen.getByText('E-mail ou senha incorretos.')).toBeInTheDocument()
    })
  })

  it('exibe mensagem de erro genérica para outros erros', async () => {
    const user = userEvent.setup()
    const err = Object.assign(new Error('Serviço indisponível'), { status: 503 })
    const loginFn = vi.fn().mockRejectedValue(err)
    renderLogin(loginFn)

    await user.type(screen.getByPlaceholderText('seu@email.com'), 'a@b.com')
    await user.type(screen.getByPlaceholderText('Sua senha'), '123')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(screen.getByText('Serviço indisponível')).toBeInTheDocument()
    })
  })

  it('desabilita botão durante carregamento', async () => {
    const user = userEvent.setup()
    let resolveLogin
    const loginFn = vi.fn().mockReturnValue(new Promise(res => { resolveLogin = res }))
    renderLogin(loginFn)

    await user.type(screen.getByPlaceholderText('seu@email.com'), 'a@b.com')
    await user.type(screen.getByPlaceholderText('Sua senha'), '123')

    const btn = screen.getByRole('button', { name: /entrar/i })
    await user.click(btn)

    await waitFor(() => expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled())

    resolveLogin({})
  })
})
