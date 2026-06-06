import { describe, it, expect, beforeEach, vi } from 'vitest'
import { normalizar, SLUG_TO_NOME } from '../utils/lancamento'
import { financeiro, notasFiscais, sefaz, commodities } from '../services/api'

// ── normalizar ────────────────────────────────────────────────────

describe('normalizar', () => {
  it('mapeia campos da API para o formato interno', () => {
    const raw = {
      _id: 'abc123',
      description: 'Herbicida Glifosato',
      category: 'insumos',
      value: 4800,
      date: '2026-05-28',
      type: 'despesa',
      origin: 'whatsapp',
    }
    const result = normalizar(raw)
    expect(result).toEqual({
      _id: 'abc123',
      descricao: 'Herbicida Glifosato',
      categoria: 'Insumos',
      valor: 4800,
      data: '2026-05-28',
      tipo: 'saida',
      origem: 'whatsapp',
    })
  })

  it('mapeia type "receita" para tipo "entrada"', () => {
    const result = normalizar({ type: 'receita', category: 'receitas' })
    expect(result.tipo).toBe('entrada')
  })

  it('categoria desconhecida mantém o slug original', () => {
    const result = normalizar({ category: 'categoria_nova' })
    expect(result.categoria).toBe('categoria_nova')
  })
})

describe('SLUG_TO_NOME', () => {
  it('cobre todas as categorias esperadas', () => {
    const esperados = ['insumos', 'maquinario', 'mao_de_obra', 'combustivel', 'arrendamento', 'receitas', 'outros']
    for (const slug of esperados) {
      expect(SLUG_TO_NOME[slug]).toBeTruthy()
    }
  })
})

// ── api — novos módulos ───────────────────────────────────────────

function mockFetch(status, body) {
  global.fetch = vi.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  })
}

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('financeiro — novos endpoints', () => {
  it('resumo chama a rota correta', async () => {
    mockFetch(200, { data: {} })
    await financeiro.resumo('slug-1')
    expect(fetch.mock.calls[0][0]).toContain('/users/slug-1/financeiro/resumo')
  })

  it('evolucao chama a rota correta', async () => {
    mockFetch(200, { data: [] })
    await financeiro.evolucao('slug-1')
    expect(fetch.mock.calls[0][0]).toContain('/users/slug-1/financeiro/evolucao')
  })

  it('categorias chama a rota correta', async () => {
    mockFetch(200, { data: [] })
    await financeiro.categorias('slug-1')
    expect(fetch.mock.calls[0][0]).toContain('/users/slug-1/financeiro/categorias')
  })
})

describe('notasFiscais', () => {
  it('listar chama a rota correta', async () => {
    mockFetch(200, { data: [] })
    await notasFiscais.listar('slug-1')
    expect(fetch.mock.calls[0][0]).toContain('/users/slug-1/notas-fiscais')
  })

  it('emitir faz POST com body', async () => {
    mockFetch(201, { data: {} })
    await notasFiscais.emitir('slug-1', { tipo: 'NF-e' })
    const [, options] = fetch.mock.calls[0]
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual({ tipo: 'NF-e' })
  })
})

describe('sefaz', () => {
  it('listar chama a rota correta', async () => {
    mockFetch(200, { data: [] })
    await sefaz.listar('slug-1')
    expect(fetch.mock.calls[0][0]).toContain('/users/slug-1/sefaz/nfe-recebidas')
  })

  it('sincronizar faz POST', async () => {
    mockFetch(200, {})
    await sefaz.sincronizar('slug-1')
    const [, options] = fetch.mock.calls[0]
    expect(options.method).toBe('POST')
    expect(fetch.mock.calls[0][0]).toContain('/users/slug-1/sefaz/sincronizar')
  })
})

describe('commodities', () => {
  it('listar chama a rota correta', async () => {
    mockFetch(200, { data: [] })
    await commodities.listar()
    expect(fetch.mock.calls[0][0]).toContain('/commodities')
  })
})
