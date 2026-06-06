import { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  RefreshCw, CheckCircle2, Clock, Download, Search,
  ArrowDownCircle, ShieldCheck, AlertCircle, Zap,
} from 'lucide-react'
import { sefaz as sefazApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const fmt = (v) => (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')

export default function Sefaz() {
  const { user } = useAuth()
  const [lista, setLista] = useState([])
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [sincronizando, setSincronizando] = useState(false)
  const [ultimaSync, setUltimaSync] = useState('—')

  useEffect(() => {
    if (!user?.slug) return
    sefazApi.listar(user.slug).then(r => setLista(r?.data ?? [])).catch(() => {})
  }, [user?.slug])

  const filtradas = lista.filter((nf) => {
    const ok = filtroStatus === 'todos' || nf.status === filtroStatus
    const match =
      (nf.numero ?? '').toLowerCase().includes(busca.toLowerCase()) ||
      (nf.emitente ?? '').toLowerCase().includes(busca.toLowerCase()) ||
      (nf.descricao ?? '').toLowerCase().includes(busca.toLowerCase())
    return ok && match
  })

  const totalImportadas = lista.filter(n => n.status === 'importada').length
  const totalPendentes  = lista.filter(n => n.status === 'pendente').length
  const totalValor = lista.reduce((acc, n) => acc + (n.valor ?? 0), 0)

  async function handleSync() {
    if (!user?.slug) return
    setSincronizando(true)
    try {
      await sefazApi.sincronizar(user.slug)
      const r = await sefazApi.listar(user.slug)
      setLista(r?.data ?? [])
      setUltimaSync(new Date().toLocaleString('pt-BR'))
    } catch {}
    finally { setSincronizando(false) }
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Integração SEFAZ</PageTitle>
          <PageSub>Recebimento automático de NF-e de receitas e despesas</PageSub>
        </div>
        <SyncBtn onClick={handleSync} disabled={sincronizando}>
          <RefreshCw size={17} className={sincronizando ? 'spin' : ''} />
          {sincronizando ? 'Sincronizando…' : 'Sincronizar Agora'}
        </SyncBtn>
      </PageHeader>

      {/* Status da conexão */}
      <StatusCard>
        <StatusLeft>
          <StatusDot />
          <div>
            <StatusTitle>Conectado à SEFAZ MT</StatusTitle>
            <StatusSub>Ambiente: Produção · Última sincronização: {ultimaSync}</StatusSub>
          </div>
        </StatusLeft>
        <StatusRight>
          <ShieldCheck size={32} color="#40916C" />
        </StatusRight>
      </StatusCard>

      {/* Info box */}
      <InfoBox>
        <Zap size={16} color="#4C6EF5" />
        <span>
          O sistema monitora automaticamente as NF-e emitidas em seu CNPJ na base da SEFAZ e as importa como <strong>receitas</strong> ou <strong>despesas</strong>, sem necessidade de lançamento manual.
        </span>
      </InfoBox>

      <CardsGrid>
        <SCard accent="#40916C">
          <SCardIcon bg="#E9F5EE"><CheckCircle2 size={20} color="#40916C" /></SCardIcon>
          <SCardInfo>
            <SCardLabel>Importadas</SCardLabel>
            <SCardVal>{totalImportadas}</SCardVal>
          </SCardInfo>
        </SCard>
        <SCard accent="#F4A261">
          <SCardIcon bg="#FFF8EE"><Clock size={20} color="#F4A261" /></SCardIcon>
          <SCardInfo>
            <SCardLabel>Aguardando Aprovação</SCardLabel>
            <SCardVal>{totalPendentes}</SCardVal>
          </SCardInfo>
        </SCard>
        <SCard accent="#4C6EF5">
          <SCardIcon bg="#EEF2FF"><ArrowDownCircle size={20} color="#4C6EF5" /></SCardIcon>
          <SCardInfo>
            <SCardLabel>Total Recebidas</SCardLabel>
            <SCardVal>{lista.length}</SCardVal>
          </SCardInfo>
        </SCard>
        <SCard accent="#2D6A4F">
          <SCardIcon bg="#E9F5EE"><Download size={20} color="#2D6A4F" /></SCardIcon>
          <SCardInfo>
            <SCardLabel>Volume Total</SCardLabel>
            <SCardVal style={{ fontSize: '1.1rem' }}>{fmt(totalValor)}</SCardVal>
          </SCardInfo>
        </SCard>
      </CardsGrid>

      {totalPendentes > 0 && (
        <AlertBanner>
          <AlertCircle size={18} color="#856404" />
          <span>
            Você tem <strong>{totalPendentes} notas</strong> aguardando confirmação para importação automática.
          </span>
          <ApproveBtn onClick={() => alert('Notas aprovadas e lançadas automaticamente.')}>
            Aprovar todas
          </ApproveBtn>
        </AlertBanner>
      )}

      <TableCard>
        <Toolbar>
          <SearchWrap>
            <Search size={16} />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por número, emitente ou descrição…"
            />
          </SearchWrap>
          <Filters>
            {['todos', 'importada', 'pendente'].map((s) => (
              <FilterBtn key={s} active={filtroStatus === s} onClick={() => setFiltroStatus(s)}>
                {s === 'todos' ? 'Todos' : s === 'importada' ? 'Importadas' : 'Pendentes'}
              </FilterBtn>
            ))}
          </Filters>
        </Toolbar>

        <Table>
          <thead>
            <tr>
              <Th>Número</Th>
              <Th>Emitente</Th>
              <Th>Descrição</Th>
              <Th>Categoria</Th>
              <Th>Data</Th>
              <Th>Valor</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((nf) => (
              <tr key={nf._id ?? nf.id}>
                <Td><NumeroNF>{nf.numero}</NumeroNF></Td>
                <Td>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1A1A2E' }}>{nf.emitente}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6C757D' }}>{nf.cnpjEmitente}</div>
                </Td>
                <Td style={{ fontSize: '0.85rem', color: '#495057', maxWidth: 200 }}>{nf.descricao}</Td>
                <Td>
                  <CategoriaBadge>{nf.categoria}</CategoriaBadge>
                </Td>
                <Td style={{ fontSize: '0.85rem', color: '#6C757D' }}>{fmtDate(nf.data)}</Td>
                <Td><ValorNF>{fmt(nf.valor)}</ValorNF></Td>
                <Td>
                  {nf.status === 'importada' ? (
                    <StatusBadge color="#40916C" bg="#E9F5EE">
                      <CheckCircle2 size={12} /> Importada
                    </StatusBadge>
                  ) : (
                    <StatusBadge color="#F4A261" bg="#FFF8EE">
                      <Clock size={12} /> Pendente
                    </StatusBadge>
                  )}
                </Td>
                <Td>
                  <AcoesWrap>
                    <IconBtn title="Baixar XML">
                      <Download size={15} />
                    </IconBtn>
                    {nf.status === 'pendente' && (
                      <ImportarBtn
                        onClick={() => alert(`NF-e ${nf.numero} importada como ${nf.categoria}.`)}
                      >
                        Importar
                      </ImportarBtn>
                    )}
                  </AcoesWrap>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>

        {filtradas.length === 0 && (
          <Empty>
            <ArrowDownCircle size={36} color="#DEE2E6" />
            <p>Nenhuma NF-e encontrada.</p>
          </Empty>
        )}
      </TableCard>
    </Page>
  )
}

/* ── STYLES ─────────────────────────────────────────────────── */
const Page = styled.div`padding: 32px;`

const PageHeader = styled.div`
  display: flex; align-items: flex-start; justify-content: space-between;
  flex-wrap: wrap; gap: 16px; margin-bottom: 24px;
`
const PageTitle = styled.h1`font-size: 1.5rem; font-weight: 800; color: #1A1A2E;`
const PageSub = styled.p`font-size: 0.875rem; color: #6C757D; margin-top: 2px;`

const SyncBtn = styled.button`
  display: inline-flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #2D6A4F, #40916C);
  color: #fff; font-weight: 600; font-size: 0.9rem;
  padding: 10px 20px; border-radius: 9px; cursor: pointer;
  transition: all 0.2s; box-shadow: 0 4px 12px rgba(45,106,79,0.35);
  opacity: ${({ disabled }) => disabled ? 0.7 : 1};
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`

const StatusCard = styled.div`
  background: #fff; border: 1px solid #E9F5EE; border-radius: 12px;
  padding: 18px 20px; margin-bottom: 16px;
  display: flex; align-items: center; justify-content: space-between;
`
const StatusLeft = styled.div`display: flex; align-items: center; gap: 12px;`
const StatusDot = styled.div`
  width: 11px; height: 11px; border-radius: 50%; background: #40916C;
  box-shadow: 0 0 0 3px rgba(64,145,108,0.2);
`
const StatusTitle = styled.p`font-weight: 600; font-size: 0.9375rem; color: #1A1A2E;`
const StatusSub = styled.p`font-size: 0.8rem; color: #6C757D; margin-top: 2px;`
const StatusRight = styled.div``

const InfoBox = styled.div`
  display: flex; align-items: flex-start; gap: 10px;
  background: #EEF2FF; border: 1px solid #C5D2F6; border-radius: 8px;
  padding: 12px 14px; margin-bottom: 24px;
  span { font-size: 0.8125rem; color: #3730A3; line-height: 1.5; }
  strong { font-weight: 600; }
`

const CardsGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 16px; margin-bottom: 20px;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
`
const SCard = styled.div`
  background: #fff; border: 1px solid #F1F3F5; border-radius: 12px;
  padding: 20px; display: flex; align-items: center; gap: 14px;
  border-left: 3px solid ${({ accent }) => accent};
`
const SCardIcon = styled.div`
  width: 42px; height: 42px; border-radius: 10px;
  background: ${({ bg }) => bg};
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
`
const SCardInfo = styled.div``
const SCardLabel = styled.p`font-size: 0.78rem; color: #6C757D;`
const SCardVal = styled.p`font-size: 1.5rem; font-weight: 800; color: #1A1A2E;`

const AlertBanner = styled.div`
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  background: #FFFBEA; border: 1px solid #FDE68A; border-radius: 10px;
  padding: 14px 16px; margin-bottom: 20px;
  span { font-size: 0.875rem; color: #92400E; flex: 1; }
  strong { font-weight: 700; }
`
const ApproveBtn = styled.button`
  background: #F59E0B; color: #fff; font-weight: 600; font-size: 0.8125rem;
  padding: 7px 14px; border-radius: 7px; cursor: pointer;
  &:hover { background: #D97706; }
`

const TableCard = styled.div`
  background: #fff; border: 1px solid #F1F3F5; border-radius: 14px; overflow: hidden;
`
const Toolbar = styled.div`
  display: flex; align-items: center; flex-wrap: wrap; gap: 12px;
  padding: 16px 20px; border-bottom: 1px solid #F1F3F5;
`
const SearchWrap = styled.div`
  display: flex; align-items: center; gap: 8px;
  background: #F8F9FA; border-radius: 8px; padding: 8px 14px; flex: 1; min-width: 220px;
  svg { color: #ADB5BD; flex-shrink: 0; }
  input { border: none; background: transparent; font-size: 0.875rem; color: #495057; width: 100%; outline: none; }
`
const Filters = styled.div`display: flex; gap: 6px;`
const FilterBtn = styled.button`
  padding: 6px 14px; border-radius: 99px; font-size: 0.8rem; font-weight: 500;
  cursor: pointer; transition: all 0.2s;
  background: ${({ active }) => active ? '#1B4332' : '#F1F3F5'};
  color: ${({ active }) => active ? '#fff' : '#495057'};
`
const Table = styled.table`width: 100%; border-collapse: collapse;`
const Th = styled.th`
  text-align: left; padding: 12px 16px; font-size: 0.75rem;
  font-weight: 600; color: #6C757D; background: #F8F9FA; border-bottom: 1px solid #F1F3F5;
`
const Td = styled.td`padding: 14px 16px; border-bottom: 1px solid #F9FAFB; vertical-align: middle;`
const NumeroNF = styled.span`font-size: 0.85rem; font-weight: 600; color: #2D6A4F; font-family: monospace;`
const CategoriaBadge = styled.span`
  background: #F1F3F5; color: #495057; font-size: 0.75rem;
  font-weight: 600; padding: 4px 10px; border-radius: 6px;
`
const ValorNF = styled.span`font-weight: 700; color: #1A1A2E; font-size: 0.9rem;`
const StatusBadge = styled.span`
  display: inline-flex; align-items: center; gap: 5px;
  background: ${({ bg }) => bg}; color: ${({ color }) => color};
  font-size: 0.75rem; font-weight: 600; padding: 4px 10px; border-radius: 99px;
`
const AcoesWrap = styled.div`display: flex; gap: 6px; align-items: center;`
const IconBtn = styled.button`
  width: 30px; height: 30px; border-radius: 7px;
  background: #F8F9FA; color: #6C757D; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
  &:hover { background: #E9F5EE; color: #2D6A4F; }
`
const ImportarBtn = styled.button`
  padding: 5px 12px; border-radius: 7px; font-size: 0.78rem; font-weight: 600;
  color: #fff; background: #2D6A4F; cursor: pointer;
  &:hover { background: #40916C; }
`
const Empty = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 48px; color: #ADB5BD; font-size: 0.9rem;
`
