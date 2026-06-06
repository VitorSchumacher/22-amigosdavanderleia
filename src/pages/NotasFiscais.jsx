import { useState } from 'react'
import styled from 'styled-components'
import {
  FileText, CheckCircle2, XCircle, Clock, Download,
  Plus, Search, Eye, AlertCircle,
} from 'lucide-react'
import { notasFiscais } from '../data/mockData'

const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')

const STATUS = {
  autorizada:       { label: 'Autorizada',       color: '#40916C', bg: '#E9F5EE', Icon: CheckCircle2 },
  em_processamento: { label: 'Em processamento', color: '#F4A261', bg: '#FFF8EE', Icon: Clock },
  cancelada:        { label: 'Cancelada',         color: '#E63946', bg: '#FFF0EE', Icon: XCircle },
}

export default function NotasFiscais() {
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [showModal, setShowModal] = useState(false)
  const [detalhe, setDetalhe] = useState(null)

  const filtradas = notasFiscais.filter((nf) => {
    const ok = filtroStatus === 'todos' || nf.status === filtroStatus
    const match = nf.numero.toLowerCase().includes(busca.toLowerCase()) ||
      nf.destinatario.toLowerCase().includes(busca.toLowerCase()) ||
      nf.descricao.toLowerCase().includes(busca.toLowerCase())
    return ok && match
  })

  const totais = {
    emitidas:  notasFiscais.length,
    autorizadas: notasFiscais.filter(n => n.status === 'autorizada').length,
    pendentes: notasFiscais.filter(n => n.status === 'em_processamento').length,
    canceladas: notasFiscais.filter(n => n.status === 'cancelada').length,
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Notas Fiscais</PageTitle>
          <PageSub>Emissão e controle de NF-e e NFS-e</PageSub>
        </div>
        <EmitirBtn onClick={() => setShowModal(true)}>
          <Plus size={18} /> Emitir Nota Fiscal
        </EmitirBtn>
      </PageHeader>

      <CardsGrid>
        <SCard accent="#4C6EF5">
          <SCardIcon bg="#EEF2FF"><FileText size={20} color="#4C6EF5" /></SCardIcon>
          <SCardInfo>
            <SCardLabel>Total Emitidas</SCardLabel>
            <SCardVal>{totais.emitidas}</SCardVal>
          </SCardInfo>
        </SCard>
        <SCard accent="#40916C">
          <SCardIcon bg="#E9F5EE"><CheckCircle2 size={20} color="#40916C" /></SCardIcon>
          <SCardInfo>
            <SCardLabel>Autorizadas</SCardLabel>
            <SCardVal>{totais.autorizadas}</SCardVal>
          </SCardInfo>
        </SCard>
        <SCard accent="#F4A261">
          <SCardIcon bg="#FFF8EE"><Clock size={20} color="#F4A261" /></SCardIcon>
          <SCardInfo>
            <SCardLabel>Em Processamento</SCardLabel>
            <SCardVal>{totais.pendentes}</SCardVal>
          </SCardInfo>
        </SCard>
        <SCard accent="#E63946">
          <SCardIcon bg="#FFF0EE"><XCircle size={20} color="#E63946" /></SCardIcon>
          <SCardInfo>
            <SCardLabel>Canceladas</SCardLabel>
            <SCardVal>{totais.canceladas}</SCardVal>
          </SCardInfo>
        </SCard>
      </CardsGrid>

      <TableCard>
        <Toolbar>
          <SearchWrap>
            <Search size={16} />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por número, destinatário ou descrição…"
            />
          </SearchWrap>
          <Filters>
            {['todos', 'autorizada', 'em_processamento', 'cancelada'].map((s) => (
              <FilterBtn key={s} active={filtroStatus === s} onClick={() => setFiltroStatus(s)}>
                {s === 'todos' ? 'Todos' : STATUS[s]?.label}
              </FilterBtn>
            ))}
          </Filters>
        </Toolbar>

        <Table>
          <thead>
            <tr>
              <Th>Número</Th>
              <Th>Tipo</Th>
              <Th>Destinatário</Th>
              <Th>Descrição</Th>
              <Th>Data</Th>
              <Th>Valor</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((nf) => {
              const st = STATUS[nf.status]
              return (
                <tr key={nf.id}>
                  <Td><NumeroNF>{nf.numero}</NumeroNF></Td>
                  <Td><TipoBadge>{nf.tipo}</TipoBadge></Td>
                  <Td>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1A1A2E' }}>{nf.destinatario}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6C757D' }}>{nf.cnpj}</div>
                  </Td>
                  <Td style={{ fontSize: '0.85rem', color: '#495057', maxWidth: 200 }}>{nf.descricao}</Td>
                  <Td style={{ fontSize: '0.85rem', color: '#6C757D' }}>{fmtDate(nf.data)}</Td>
                  <Td><ValorNF>{fmt(nf.valor)}</ValorNF></Td>
                  <Td>
                    <StatusBadge color={st.color} bg={st.bg}>
                      <st.Icon size={12} />
                      {st.label}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <AcoesWrap>
                      <IconBtn title="Ver detalhes" onClick={() => setDetalhe(nf)}>
                        <Eye size={15} />
                      </IconBtn>
                      {nf.status === 'autorizada' && (
                        <IconBtn title="Baixar XML/DANFE">
                          <Download size={15} />
                        </IconBtn>
                      )}
                    </AcoesWrap>
                  </Td>
                </tr>
              )
            })}
          </tbody>
        </Table>

        {filtradas.length === 0 && (
          <Empty>
            <FileText size={36} color="#DEE2E6" />
            <p>Nenhuma nota encontrada.</p>
          </Empty>
        )}
      </TableCard>

      {/* Modal emitir NF */}
      {showModal && (
        <Overlay onClick={() => setShowModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>Emitir Nota Fiscal</h3>
              <CloseBtn onClick={() => setShowModal(false)}>✕</CloseBtn>
            </ModalHeader>
            <ModalBody>
              <InfoBox>
                <AlertCircle size={16} color="#F4A261" />
                <span>Integração com SEFAZ em modo de demonstração. Em produção, os dados serão enviados automaticamente ao ambiente oficial.</span>
              </InfoBox>
              <FormGrid>
                <FormGroup>
                  <label>Tipo de Nota</label>
                  <select defaultValue="NF-e">
                    <option>NF-e (Produtos)</option>
                    <option>NFS-e (Serviços)</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <label>Data de Emissão</label>
                  <input type="date" defaultValue="2026-06-05" />
                </FormGroup>
                <FormGroup full>
                  <label>Destinatário / Razão Social</label>
                  <input type="text" placeholder="Ex: Cooperativa Agrícola Sorriso" />
                </FormGroup>
                <FormGroup>
                  <label>CNPJ / CPF</label>
                  <input type="text" placeholder="00.000.000/0000-00" />
                </FormGroup>
                <FormGroup>
                  <label>Valor Total (R$)</label>
                  <input type="number" placeholder="0,00" />
                </FormGroup>
                <FormGroup full>
                  <label>Descrição do Produto / Serviço</label>
                  <input type="text" placeholder="Ex: Venda de Soja — 200 sacas" />
                </FormGroup>
              </FormGrid>
              <ModalActions>
                <CancelBtn onClick={() => setShowModal(false)}>Cancelar</CancelBtn>
                <SubmitBtn onClick={() => { alert('NF enviada para processamento na SEFAZ (demo)'); setShowModal(false) }}>
                  Emitir Nota Fiscal
                </SubmitBtn>
              </ModalActions>
            </ModalBody>
          </Modal>
        </Overlay>
      )}

      {/* Modal detalhe NF */}
      {detalhe && (
        <Overlay onClick={() => setDetalhe(null)}>
          <Modal onClick={(e) => e.stopPropagation()} wide>
            <ModalHeader>
              <h3>{detalhe.numero}</h3>
              <CloseBtn onClick={() => setDetalhe(null)}>✕</CloseBtn>
            </ModalHeader>
            <ModalBody>
              <DetalheGrid>
                <DetalheItem><span>Tipo</span><strong>{detalhe.tipo}</strong></DetalheItem>
                <DetalheItem><span>Status</span>
                  <StatusBadge color={STATUS[detalhe.status].color} bg={STATUS[detalhe.status].bg}>
                    {STATUS[detalhe.status].label}
                  </StatusBadge>
                </DetalheItem>
                <DetalheItem><span>Destinatário</span><strong>{detalhe.destinatario}</strong></DetalheItem>
                <DetalheItem><span>CNPJ</span><strong>{detalhe.cnpj}</strong></DetalheItem>
                <DetalheItem><span>Data</span><strong>{fmtDate(detalhe.data)}</strong></DetalheItem>
                <DetalheItem><span>Valor</span><strong>{fmt(detalhe.valor)}</strong></DetalheItem>
                <DetalheItem full><span>Descrição</span><strong>{detalhe.descricao}</strong></DetalheItem>
                {detalhe.chave && (
                  <DetalheItem full>
                    <span>Chave de Acesso</span>
                    <ChaveAcesso>{detalhe.chave}</ChaveAcesso>
                  </DetalheItem>
                )}
              </DetalheGrid>
              <ModalActions>
                <CancelBtn onClick={() => setDetalhe(null)}>Fechar</CancelBtn>
                {detalhe.status === 'autorizada' && (
                  <SubmitBtn onClick={() => alert('Download do XML/DANFE (demo)')}>
                    <Download size={16} /> Baixar XML / DANFE
                  </SubmitBtn>
                )}
              </ModalActions>
            </ModalBody>
          </Modal>
        </Overlay>
      )}
    </Page>
  )
}

/* ── STYLES ─────────────────────────────────────────────────── */
const Page = styled.div`padding: 32px;`

const PageHeader = styled.div`
  display: flex; align-items: flex-start; justify-content: space-between;
  flex-wrap: wrap; gap: 16px; margin-bottom: 28px;
`
const PageTitle = styled.h1`font-size: 1.5rem; font-weight: 800; color: #1A1A2E;`
const PageSub = styled.p`font-size: 0.875rem; color: #6C757D; margin-top: 2px;`

const EmitirBtn = styled.button`
  display: inline-flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #2D6A4F, #40916C);
  color: #fff; font-weight: 600; font-size: 0.9rem;
  padding: 10px 20px; border-radius: 9px; cursor: pointer;
  transition: all 0.2s; box-shadow: 0 4px 12px rgba(45,106,79,0.35);
  &:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(45,106,79,0.45); }
`

const CardsGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 16px; margin-bottom: 24px;
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
const Filters = styled.div`display: flex; gap: 6px; flex-wrap: wrap;`
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
const Td = styled.td`
  padding: 14px 16px; border-bottom: 1px solid #F9FAFB;
  vertical-align: middle;
`
const NumeroNF = styled.span`font-size: 0.85rem; font-weight: 600; color: #2D6A4F; font-family: monospace;`
const TipoBadge = styled.span`
  background: #EEF2FF; color: #4C6EF5; font-size: 0.72rem;
  font-weight: 700; padding: 3px 8px; border-radius: 6px;
`
const ValorNF = styled.span`font-weight: 700; color: #1A1A2E; font-size: 0.9rem;`
const StatusBadge = styled.span`
  display: inline-flex; align-items: center; gap: 5px;
  background: ${({ bg }) => bg}; color: ${({ color }) => color};
  font-size: 0.75rem; font-weight: 600; padding: 4px 10px; border-radius: 99px;
`
const AcoesWrap = styled.div`display: flex; gap: 6px;`
const IconBtn = styled.button`
  width: 30px; height: 30px; border-radius: 7px;
  background: #F8F9FA; color: #6C757D; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
  &:hover { background: #E9F5EE; color: #2D6A4F; }
`
const Empty = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 48px; color: #ADB5BD; font-size: 0.9rem;
`

/* Modal */
const Overlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 24px;
`
const Modal = styled.div`
  background: #fff; border-radius: 16px; width: 100%;
  max-width: ${({ wide }) => wide ? '680px' : '560px'};
  box-shadow: 0 24px 80px rgba(0,0,0,0.2); overflow: hidden;
`
const ModalHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px; border-bottom: 1px solid #F1F3F5;
  h3 { font-size: 1.1rem; font-weight: 700; color: #1A1A2E; }
`
const CloseBtn = styled.button`color: #ADB5BD; cursor: pointer; font-size: 1.1rem; &:hover { color: #1A1A2E; }`
const ModalBody = styled.div`padding: 24px;`
const InfoBox = styled.div`
  display: flex; align-items: flex-start; gap: 10px;
  background: #FFF8EE; border: 1px solid #FDECC4; border-radius: 8px;
  padding: 12px 14px; margin-bottom: 20px;
  span { font-size: 0.8125rem; color: #856404; line-height: 1.5; }
`
const FormGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 16px;`
const FormGroup = styled.div`
  grid-column: ${({ full }) => full ? '1 / -1' : 'auto'};
  display: flex; flex-direction: column; gap: 6px;
  label { font-size: 0.8125rem; font-weight: 600; color: #495057; }
  input, select {
    border: 1px solid #DEE2E6; border-radius: 8px; padding: 9px 12px;
    font-size: 0.875rem; color: #1A1A2E; outline: none;
    &:focus { border-color: #40916C; }
  }
`
const ModalActions = styled.div`
  display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px;
`
const CancelBtn = styled.button`
  padding: 10px 20px; border-radius: 8px; font-size: 0.875rem; font-weight: 500;
  color: #495057; background: #F1F3F5; cursor: pointer;
  &:hover { background: #DEE2E6; }
`
const SubmitBtn = styled.button`
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 22px; border-radius: 8px; font-size: 0.875rem; font-weight: 600;
  color: #fff; background: linear-gradient(135deg, #2D6A4F, #40916C); cursor: pointer;
  &:hover { opacity: 0.9; }
`
const DetalheGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 16px;`
const DetalheItem = styled.div`
  grid-column: ${({ full }) => full ? '1 / -1' : 'auto'};
  display: flex; flex-direction: column; gap: 4px;
  span { font-size: 0.75rem; color: #6C757D; font-weight: 500; }
  strong { font-size: 0.875rem; color: #1A1A2E; }
`
const ChaveAcesso = styled.code`
  font-size: 0.72rem; color: #495057; background: #F8F9FA;
  padding: 8px 10px; border-radius: 6px; word-break: break-all;
  font-family: monospace;
`
