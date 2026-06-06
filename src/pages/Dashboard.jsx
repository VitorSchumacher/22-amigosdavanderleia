import styled from 'styled-components'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight,
  CloudRain, Thermometer, Wind,
} from 'lucide-react'
import {
  resumoFinanceiro, evolucaoMensal, gastosPorCategoria,
  gastos, precosCommodities,
} from '../data/mockData'

const fmt = (v) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Dashboard() {
  const ultimosGastos = gastos.slice(0, 5)

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Dashboard</PageTitle>
          <PageSub>Maio de 2026 — Fazenda Boa Esperança</PageSub>
        </div>
      </PageHeader>

      {/* Cards de resumo */}
      <CardsGrid>
        <SummaryCard color="#2D6A4F">
          <CardIcon bg="#E9F5EE"><Wallet size={22} color="#2D6A4F" /></CardIcon>
          <CardData>
            <CardLabel>Saldo Atual</CardLabel>
            <CardValue>{fmt(resumoFinanceiro.saldoAtual)}</CardValue>
          </CardData>
          <CardBadge positive>
            <TrendingUp size={13} />
            +{resumoFinanceiro.variacaoMes}%
          </CardBadge>
        </SummaryCard>

        <SummaryCard>
          <CardIcon bg="#E9F5EE"><ArrowUpRight size={22} color="#40916C" /></CardIcon>
          <CardData>
            <CardLabel>Entradas no mês</CardLabel>
            <CardValue green>{fmt(resumoFinanceiro.totalEntradas)}</CardValue>
          </CardData>
        </SummaryCard>

        <SummaryCard>
          <CardIcon bg="#FFF0EE"><ArrowDownRight size={22} color="#E63946" /></CardIcon>
          <CardData>
            <CardLabel>Saídas no mês</CardLabel>
            <CardValue red>{fmt(resumoFinanceiro.totalSaidas)}</CardValue>
          </CardData>
        </SummaryCard>

        <SummaryCard>
          <CardIcon bg="#FFF8EE"><TrendingUp size={22} color="#F4A261" /></CardIcon>
          <CardData>
            <CardLabel>Resultado</CardLabel>
            <CardValue green>
              {fmt(resumoFinanceiro.totalEntradas - resumoFinanceiro.totalSaidas)}
            </CardValue>
          </CardData>
        </SummaryCard>
      </CardsGrid>

      <GridTwo>
        {/* Evolução mensal */}
        <ChartCard>
          <ChartTitle>Evolução Mensal</ChartTitle>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={evolucaoMensal} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#40916C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#40916C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="despGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E63946" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#E63946" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => fmt(v)} />
              <Legend />
              <Area type="monotone" dataKey="receitas" name="Receitas" stroke="#40916C" fill="url(#recGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="despesas" name="Despesas" stroke="#E63946" fill="url(#despGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pizza por categoria */}
        <ChartCard>
          <ChartTitle>Gastos por Categoria</ChartTitle>
          <PieWrapper>
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={gastosPorCategoria} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {gastosPorCategoria.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
            <PieLegend>
              {gastosPorCategoria.map((cat) => (
                <PieLegendItem key={cat.name}>
                  <PieDot color={cat.fill} />
                  <PieLegendText>
                    <span>{cat.name}</span>
                    <strong>{fmt(cat.value)}</strong>
                  </PieLegendText>
                </PieLegendItem>
              ))}
            </PieLegend>
          </PieWrapper>
        </ChartCard>
      </GridTwo>

      <GridTwo>
        {/* Últimas movimentações */}
        <ChartCard>
          <ChartTitle>Últimas Movimentações</ChartTitle>
          <TransactionList>
            {ultimosGastos.map((g) => (
              <TransactionItem key={g.id}>
                <TransactionInfo>
                  <TransactionName>{g.descricao}</TransactionName>
                  <TransactionMeta>
                    <TagCategoria>{g.categoria}</TagCategoria>
                    <TagOrigem whatsapp={g.origem === 'whatsapp'}>
                      {g.origem === 'whatsapp' ? 'WhatsApp' : 'Web'}
                    </TagOrigem>
                    <span>{new Date(g.data).toLocaleDateString('pt-BR')}</span>
                  </TransactionMeta>
                </TransactionInfo>
                <TransactionValue entrada={g.tipo === 'entrada'}>
                  {g.tipo === 'entrada' ? '+' : '-'} {fmt(g.valor)}
                </TransactionValue>
              </TransactionItem>
            ))}
          </TransactionList>
        </ChartCard>

        {/* Cotações + Clima */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ChartCard>
            <ChartTitle>Cotações Hoje</ChartTitle>
            <CotacoesList>
              {precosCommodities.map((c) => (
                <CotacaoItem key={c.cultura}>
                  <CotacaoNome>{c.cultura}</CotacaoNome>
                  <CotacaoPreco>{c.preco.toFixed(2)} {c.unidade}</CotacaoPreco>
                  <CotacaoVar positivo={c.variacao > 0}>
                    {c.variacao > 0
                      ? <TrendingUp size={13} />
                      : <TrendingDown size={13} />}
                    {c.variacao > 0 ? '+' : ''}{c.variacao}%
                  </CotacaoVar>
                </CotacaoItem>
              ))}
            </CotacoesList>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Previsão do Tempo — Sorriso MT</ChartTitle>
            <ClimateGrid>
              <ClimateItem>
                <Thermometer size={18} color="#F4A261" />
                <ClimateLabel>Temperatura</ClimateLabel>
                <ClimateValue>28°C / 18°C</ClimateValue>
              </ClimateItem>
              <ClimateItem>
                <CloudRain size={18} color="#457B9D" />
                <ClimateLabel>Chuva</ClimateLabel>
                <ClimateValue>12mm</ClimateValue>
              </ClimateItem>
              <ClimateItem>
                <Wind size={18} color="#74C69D" />
                <ClimateLabel>Vento</ClimateLabel>
                <ClimateValue>22 km/h</ClimateValue>
              </ClimateItem>
            </ClimateGrid>
            <AlertaClima>
              ⚠️ Possibilidade de chuva forte à tarde. Evite pulverizações.
            </AlertaClima>
          </ChartCard>
        </div>
      </GridTwo>
    </Page>
  )
}

const Page = styled.div`
  padding: 32px;
  max-width: 1280px;
`

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
`

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1A1A2E;
`

const PageSub = styled.p`
  font-size: 0.875rem;
  color: #6C757D;
  margin-top: 2px;
`

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const SummaryCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
`

const CardIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${({ bg }) => bg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const CardData = styled.div`
  flex: 1;
`

const CardLabel = styled.p`
  font-size: 0.75rem;
  color: #6C757D;
  margin-bottom: 3px;
`

const CardValue = styled.p`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ green, red }) => green ? '#40916C' : red ? '#E63946' : '#1A1A2E'};
`

const CardBadge = styled.span`
  position: absolute;
  top: 14px;
  right: 14px;
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.7rem;
  font-weight: 600;
  color: ${({ positive }) => positive ? '#40916C' : '#E63946'};
  background: ${({ positive }) => positive ? '#E9F5EE' : '#FFF0EE'};
  padding: 3px 7px;
  border-radius: 99px;
`

const GridTwo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const ChartCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
`

const ChartTitle = styled.h2`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1A1A2E;
  margin-bottom: 16px;
`

const PieWrapper = styled.div`
  display: flex;
  align-items: center;
`

const PieLegend = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const PieLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const PieDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ color }) => color};
  flex-shrink: 0;
`

const PieLegendText = styled.div`
  display: flex;
  flex-direction: column;

  span {
    font-size: 0.75rem;
    color: #6C757D;
  }

  strong {
    font-size: 0.8125rem;
    color: #1A1A2E;
  }
`

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #F1F3F5;

  &:last-child {
    border-bottom: none;
  }
`

const TransactionInfo = styled.div``

const TransactionName = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1A1A2E;
  margin-bottom: 4px;
`

const TransactionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  color: #6C757D;
`

const TagCategoria = styled.span`
  background: #F1F3F5;
  padding: 2px 7px;
  border-radius: 99px;
  color: #495057;
`

const TagOrigem = styled.span`
  background: ${({ whatsapp }) => whatsapp ? '#E7FBEF' : '#EEF2FF'};
  color: ${({ whatsapp }) => whatsapp ? '#25D366' : '#4C6EF5'};
  padding: 2px 7px;
  border-radius: 99px;
  font-weight: 500;
`

const TransactionValue = styled.p`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ entrada }) => entrada ? '#40916C' : '#E63946'};
`

const CotacoesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const CotacaoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const CotacaoNome = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1A1A2E;
  width: 70px;
`

const CotacaoPreco = styled.span`
  flex: 1;
  font-size: 0.875rem;
  color: #495057;
`

const CotacaoVar = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ positivo }) => positivo ? '#40916C' : '#E63946'};
  background: ${({ positivo }) => positivo ? '#E9F5EE' : '#FFF0EE'};
  padding: 3px 8px;
  border-radius: 99px;
`

const ClimateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 12px;
`

const ClimateItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: #F8F9FA;
  border-radius: 8px;
  padding: 10px 6px;
`

const ClimateLabel = styled.span`
  font-size: 0.7rem;
  color: #6C757D;
`

const ClimateValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1A1A2E;
`

const AlertaClima = styled.div`
  background: #FFF8E7;
  border: 1px solid #FFE08A;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.8125rem;
  color: #7C6300;
`
