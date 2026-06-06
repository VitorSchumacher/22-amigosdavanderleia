import { describe, it, expect } from 'vitest'
import {
  gastos,
  estoqueItens,
  notasFiscais,
  nfeRecebidas,
  resumoFinanceiro,
  evolucaoMensal,
  categorias,
} from '../data/mockData'

describe('gastos', () => {
  it('cada gasto tem os campos obrigatórios', () => {
    for (const g of gastos) {
      expect(g).toHaveProperty('id')
      expect(g).toHaveProperty('descricao')
      expect(g).toHaveProperty('categoria')
      expect(g).toHaveProperty('valor')
      expect(g).toHaveProperty('data')
      expect(g).toHaveProperty('tipo')
    }
  })

  it('tipo é sempre "entrada" ou "saida"', () => {
    for (const g of gastos) {
      expect(['entrada', 'saida']).toContain(g.tipo)
    }
  })

  it('valores são positivos', () => {
    for (const g of gastos) {
      expect(g.valor).toBeGreaterThan(0)
    }
  })

  it('datas seguem formato YYYY-MM-DD', () => {
    const iso = /^\d{4}-\d{2}-\d{2}$/
    for (const g of gastos) {
      expect(g.data).toMatch(iso)
    }
  })
})

describe('estoqueItens', () => {
  it('cada item tem os campos obrigatórios', () => {
    for (const item of estoqueItens) {
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('nome')
      expect(item).toHaveProperty('quantidade')
      expect(item).toHaveProperty('minimo')
      expect(item).toHaveProperty('precoUnitario')
    }
  })

  it('identifica itens com estoque abaixo do mínimo', () => {
    const criticos = estoqueItens.filter(i => i.quantidade < i.minimo)
    expect(criticos.length).toBeGreaterThan(0)
    const nomes = criticos.map(i => i.nome)
    expect(nomes).toContain('Inseticida Engeo Pleno')
    expect(nomes).toContain('Semente Soja RR2')
  })

  it('quantidades e preços são não-negativos', () => {
    for (const item of estoqueItens) {
      expect(item.quantidade).toBeGreaterThanOrEqual(0)
      expect(item.precoUnitario).toBeGreaterThan(0)
    }
  })
})

describe('notasFiscais', () => {
  it('status aceitos são autorizada, em_processamento ou cancelada', () => {
    const statusValidos = ['autorizada', 'em_processamento', 'cancelada']
    for (const nf of notasFiscais) {
      expect(statusValidos).toContain(nf.status)
    }
  })

  it('notas autorizadas têm chave de acesso preenchida', () => {
    const autorizadas = notasFiscais.filter(n => n.status === 'autorizada')
    for (const nf of autorizadas) {
      expect(nf.chave.length).toBeGreaterThan(0)
    }
  })
})

describe('nfeRecebidas', () => {
  it('status é importada ou pendente', () => {
    for (const nfe of nfeRecebidas) {
      expect(['importada', 'pendente']).toContain(nfe.status)
    }
  })

  it('todas são do tipo despesa', () => {
    for (const nfe of nfeRecebidas) {
      expect(nfe.tipo).toBe('despesa')
    }
  })
})

describe('resumoFinanceiro', () => {
  it('tem todos os campos necessários', () => {
    expect(resumoFinanceiro).toHaveProperty('saldoAtual')
    expect(resumoFinanceiro).toHaveProperty('totalEntradas')
    expect(resumoFinanceiro).toHaveProperty('totalSaidas')
    expect(resumoFinanceiro).toHaveProperty('variacaoMes')
  })

  it('saldo atual é positivo', () => {
    expect(resumoFinanceiro.saldoAtual).toBeGreaterThan(0)
  })

  it('entradas são maiores que saídas (resultado positivo)', () => {
    expect(resumoFinanceiro.totalEntradas).toBeGreaterThan(resumoFinanceiro.totalSaidas)
  })
})

describe('evolucaoMensal', () => {
  it('tem exatamente 6 meses', () => {
    expect(evolucaoMensal).toHaveLength(6)
  })

  it('receitas e despesas são não-negativos', () => {
    for (const mes of evolucaoMensal) {
      expect(mes.receitas).toBeGreaterThanOrEqual(0)
      expect(mes.despesas).toBeGreaterThanOrEqual(0)
    }
  })
})

describe('categorias', () => {
  it('cada categoria tem id, nome, cor e icone', () => {
    for (const cat of categorias) {
      expect(cat).toHaveProperty('id')
      expect(cat).toHaveProperty('nome')
      expect(cat).toHaveProperty('cor')
      expect(cat).toHaveProperty('icone')
    }
  })

  it('IDs são únicos', () => {
    const ids = categorias.map(c => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
