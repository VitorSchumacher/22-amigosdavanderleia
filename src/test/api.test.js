import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from '../services/api'

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

function mockFetch(status, body) {
  global.fetch = vi.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  })
}

describe('api', () => {
  it('GET envia Authorization quando token existe', async () => {
    localStorage.setItem('guiar_token', 'tok123')
    mockFetch(200, { id: 1 })

    await api.get('/auth/me')

    const [, options] = fetch.mock.calls[0]
    expect(options.headers['Authorization']).toBe('Bearer tok123')
  })

  it('GET não envia Authorization sem token', async () => {
    mockFetch(200, { ok: true })

    await api.get('/public')

    const [, options] = fetch.mock.calls[0]
    expect(options.headers['Authorization']).toBeUndefined()
  })

  it('retorna null para status 204', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 204,
      ok: true,
      json: () => Promise.resolve(null),
    })

    const result = await api.delete('/recurso/1')
    expect(result).toBeNull()
  })

  it('lança erro com mensagem quando resposta não é ok', async () => {
    mockFetch(401, { message: 'Não autorizado' })

    await expect(api.get('/protegido')).rejects.toThrow('Não autorizado')
  })

  it('erro inclui status HTTP', async () => {
    mockFetch(404, { message: 'Não encontrado' })

    try {
      await api.get('/inexistente')
    } catch (err) {
      expect(err.status).toBe(404)
    }
  })

  it('erro sem mensagem usa fallback genérico', async () => {
    mockFetch(500, {})

    await expect(api.get('/falhou')).rejects.toThrow('Erro inesperado')
  })

  it('POST envia body como JSON', async () => {
    mockFetch(200, { token: 'abc' })

    await api.post('/auth/login', { email: 'a@b.com', password: '123' })

    const [, options] = fetch.mock.calls[0]
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual({ email: 'a@b.com', password: '123' })
  })

  it('PUT envia method PUT com body', async () => {
    mockFetch(200, { data: {} })

    await api.put('/users/slug-1', { name: 'Novo Nome' })

    const [, options] = fetch.mock.calls[0]
    expect(options.method).toBe('PUT')
    expect(JSON.parse(options.body)).toEqual({ name: 'Novo Nome' })
  })
})
