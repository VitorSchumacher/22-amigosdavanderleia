import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from '../components/PrivateRoute'
import * as AuthModule from '../contexts/AuthContext'

function renderWithRouter(authState) {
  vi.spyOn(AuthModule, 'useAuth').mockReturnValue(authState)

  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<span>conteudo-privado</span>} />
        </Route>
        <Route path="/login" element={<span>pagina-login</span>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('PrivateRoute', () => {
  it('renderiza conteúdo quando usuário está autenticado', () => {
    renderWithRouter({ user: { name: 'João' }, loading: false })
    expect(screen.getByText('conteudo-privado')).toBeInTheDocument()
  })

  it('redireciona para /login quando sem usuário', () => {
    renderWithRouter({ user: null, loading: false })
    expect(screen.getByText('pagina-login')).toBeInTheDocument()
  })

  it('não renderiza nada enquanto carregando', () => {
    renderWithRouter({ user: null, loading: true })
    expect(screen.queryByText('conteudo-privado')).not.toBeInTheDocument()
    expect(screen.queryByText('pagina-login')).not.toBeInTheDocument()
  })
})
