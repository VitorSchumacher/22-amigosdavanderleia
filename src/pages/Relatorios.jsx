import { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { financeiro } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const fmt = (v) => (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Relatorios() {
  const { user } = useAuth()
  const [evolucao, setEvolucao] = useState([])
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    if (!user?.slug) return
    financeiro.evolucao(user.slug).then(r => setEvolucao(r?.data ?? [])).catch(() => {})
    financeiro.categorias(user.slug).then(r => setCategorias(r?.data ?? [])).catch(() => {})
  }, [user?.slug])

  return (
    <Page>
      <PageHeader>
        <PageTitle>Relatórios</PageTitle>
        <PageSub>Análise financeira da safra 2025/2026</PageSub>
      </PageHeader>

      <CardsRow>
        {categorias.map(cat => (
          <CatCard key={cat.name}>
            <CatDot color={cat.fill} />
            <CatInfo>
              <CatName>{cat.name}</CatName>
              <CatValue>{fmt(cat.value)}</CatValue>
            </CatInfo>
          </CatCard>
        ))}
      </CardsRow>

      <ChartCard>
        <ChartTitle>Comparativo Mensal — Receitas vs Despesas</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={evolucao} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={v => fmt(v)} />
            <Legend />
            <Bar dataKey="receitas" name="Receitas" fill="#40916C" radius={[4, 4, 0, 0]} />
            <Bar dataKey="despesas" name="Despesas" fill="#E63946" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ExportRow>
        <ExportBtn>Exportar PDF</ExportBtn>
        <ExportBtn>Exportar Excel</ExportBtn>
      </ExportRow>
    </Page>
  )
}

const Page = styled.div`padding: 32px; max-width: 1100px;`
const PageHeader = styled.div`margin-bottom: 24px;`
const PageTitle = styled.h1`font-size: 1.5rem; font-weight: 700; color: #1A1A2E;`
const PageSub = styled.p`font-size: 0.875rem; color: #6C757D; margin-top: 2px;`

const CardsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
`

const CatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border-radius: 10px;
  padding: 14px 18px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  flex: 1;
  min-width: 160px;
`

const CatDot = styled.div`
  width: 12px; height: 12px;
  border-radius: 50%;
  background: ${({ color }) => color};
  flex-shrink: 0;
`

const CatInfo = styled.div``
const CatName = styled.p`font-size: 0.78rem; color: #6C757D;`
const CatValue = styled.p`font-size: 1rem; font-weight: 700; color: #1A1A2E;`

const ChartCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  margin-bottom: 20px;
`

const ChartTitle = styled.h2`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1A1A2E;
  margin-bottom: 16px;
`

const ExportRow = styled.div`display: flex; gap: 10px;`

const ExportBtn = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: 1.5px solid #DEE2E6;
  font-size: 0.9rem;
  font-weight: 500;
  color: #495057;
  background: #fff;
  transition: all 0.15s;

  &:hover { border-color: #2D6A4F; color: #2D6A4F; }
`
