import { useState } from 'react'
import styled from 'styled-components'
import {
  Package, AlertTriangle, TrendingDown, TrendingUp,
  Plus, Search, ArrowUpCircle, ArrowDownCircle, History,
} from 'lucide-react'
import { estoqueItens, movimentacoesEstoque } from '../data/mockData'

const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')

export default function Estoque() {
  const [busca, setBusca] = useState('')
  const [aba, setAba] = useState('itens')
  const [showModal, setShowModal] = useState(false)
  const [tipoMovimento, setTipoMovimento] = useState('entrada')

  const itensEmAlerta = estoqueItens.filter(i => i.quantidade <= i.minimo)
  const valorTotal = estoqueItens.reduce((acc, i) => acc + i.quantidade * i.precoUnitario, 0)

  const itensFiltrados = estoqueItens.filter((i) =>
    i.nome.toLowerCase().includes(busca.toLowerCase()) ||
    i.categoria.toLowerCase().includes(busca.toLowerCase())
  )

  const movFiltradas = movimentacoesEstoque.filter((m) =>
    m.item.toLowerCase().includes(busca.toLowerCase())
  )

  function statusEstoque(item) {
    if (item.quantidade <= item.minimo) return { label: 'Estoque Baixo', color: '#E63946', bg: '#FFF0EE' }
    if (item.quantidade <= item.minimo * 1.5) return { label: 'Atenção', color: '#F4A261', bg: '#FFF8EE' }
    return { label: 'Normal', color: '#40916C', bg: '#E9F5EE' }
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Controle de Estoque</PageTitle>
          <PageSub>Insumos, combustíveis e materiais da propriedade</PageSub>
        </div>
        <HeaderActions>
          <MovBtn entrada onClick={() => { setTipoMovimento('entrada'); setShowModal(true) }}>
            <ArrowUpCircle size={16} /> Entrada
          </MovBtn>
          <MovBtn onClick={() => { setTipoMovimento('saida'); setShowModal(true) }}>
            <ArrowDownCircle size={16} /> Saída
          </MovBtn>
        </HeaderActions>
      </PageHeader>

      {itensEmAlerta.length > 0 && (
        <AlertBanner>
          <AlertTriangle size={18} color="#92400E" />
          <span>
            <strong>{itensEmAlerta.length} {itensEmAlerta.length === 1 ? 'item' : 'itens'}</strong> com estoque abaixo do mínimo:{' '}
            {itensEmAlerta.map(i => i.nome).join(', ')}
          </span>
        </AlertBanner>
      )}

      <CardsGrid>
        <SCard accent="#4C6EF5">
          <SCardIcon bg="#EEF2FF"><Package size={20} color="#4C6EF5" /></SCardIcon>
          <SCardInfo>
            <SCardLabel>Total de Itens</SCardLabel>
            <SCardVal>{estoqueItens.length}</SCardVal>
          </SCardInfo>
        </SCard>
        <SCard accent="#E63946">
          <SCardIcon bg="#FFF0EE"><AlertTriangle size={20} color="#E63946" /></SCardIcon>
          <SCardInfo>
            <SCardLabel>Estoque Baixo</SCardLabel>
            <SCardVal>{itensEmAlerta.length}</SCardVal>
          </SCardInfo>
        </SCard>
        <SCard accent="#40916C">
          <SCardIcon bg="#E9F5EE"><TrendingUp size={20} color="#40916C" /></SCardIcon>
          <SCardInfo>
            <SCardLabel>Entradas este mês</SCardLabel>
            <SCardVal>{movimentacoesEstoque.filter(m => m.tipo === 'entrada').length}</SCardVal>
          </SCardInfo>
        </SCard>
        <SCard accent="#2D6A4F">
          <SCardIcon bg="#E9F5EE"><Package size={20} color="#2D6A4F" /></SCardIcon>
          <SCardInfo>
            <SCardLabel>Valor em Estoque</SCardLabel>
            <SCardVal style={{ fontSize: '1.1rem' }}>{fmt(valorTotal)}</SCardVal>
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
              placeholder="Buscar por nome ou categoria…"
            />
          </SearchWrap>
          <Abas>
            <AbaBtn active={aba === 'itens'} onClick={() => setAba('itens')}>
              <Package size={14} /> Itens
            </AbaBtn>
            <AbaBtn active={aba === 'movimentos'} onClick={() => setAba('movimentos')}>
              <History size={14} /> Movimentos
            </AbaBtn>
          </Abas>
        </Toolbar>

        {aba === 'itens' ? (
          <Table>
            <thead>
              <tr>
                <Th>Item</Th>
                <Th>Categoria</Th>
                <Th>Quantidade</Th>
                <Th>Mínimo</Th>
                <Th>Localização</Th>
                <Th>Última Entrada</Th>
                <Th>Valor Unitário</Th>
                <Th>Valor Total</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {itensFiltrados.map((item) => {
                const st = statusEstoque(item)
                return (
                  <tr key={item.id}>
                    <Td>
                      <NomeItem>{item.nome}</NomeItem>
                    </Td>
                    <Td><CategoriaBadge>{item.categoria}</CategoriaBadge></Td>
                    <Td>
                      <QuantWrap baixo={item.quantidade <= item.minimo}>
                        <strong>{item.quantidade.toLocaleString('pt-BR')}</strong>
                        <span>{item.unidade}</span>
                      </QuantWrap>
                    </Td>
                    <Td style={{ fontSize: '0.85rem', color: '#6C757D' }}>
                      {item.minimo} {item.unidade}
                    </Td>
                    <Td style={{ fontSize: '0.85rem', color: '#495057' }}>{item.localizacao}</Td>
                    <Td style={{ fontSize: '0.85rem', color: '#6C757D' }}>{fmtDate(item.ultimaEntrada)}</Td>
                    <Td style={{ fontSize: '0.85rem', color: '#495057' }}>
                      {fmt(item.precoUnitario)}/{item.unidade}
                    </Td>
                    <Td>
                      <ValorTotal>{fmt(item.quantidade * item.precoUnitario)}</ValorTotal>
                    </Td>
                    <Td>
                      <StatusBadge color={st.color} bg={st.bg}>
                        {st.label === 'Estoque Baixo' && <AlertTriangle size={11} />}
                        {st.label}
                      </StatusBadge>
                    </Td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Item</Th>
                <Th>Tipo</Th>
                <Th>Quantidade</Th>
                <Th>Data</Th>
                <Th>Motivo</Th>
                <Th>NF-e Vinculada</Th>
              </tr>
            </thead>
            <tbody>
              {movFiltradas.map((m) => (
                <tr key={m.id}>
                  <Td><NomeItem>{m.item}</NomeItem></Td>
                  <Td>
                    {m.tipo === 'entrada' ? (
                      <TipoBadge entrada>
                        <TrendingUp size={12} /> Entrada
                      </TipoBadge>
                    ) : (
                      <TipoBadge>
                        <TrendingDown size={12} /> Saída
                      </TipoBadge>
                    )}
                  </Td>
                  <Td>
                    <QuantWrap>
                      <strong>{m.quantidade.toLocaleString('pt-BR')}</strong>
                    </QuantWrap>
                  </Td>
                  <Td style={{ fontSize: '0.85rem', color: '#6C757D' }}>{fmtDate(m.data)}</Td>
                  <Td style={{ fontSize: '0.85rem', color: '#495057' }}>{m.motivo}</Td>
                  <Td>
                    {m.nfe ? (
                      <NfeBadge>{m.nfe}</NfeBadge>
                    ) : (
                      <span style={{ color: '#ADB5BD', fontSize: '0.8rem' }}>—</span>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </TableCard>

      {/* Modal movimentação */}
      {showModal && (
        <Overlay onClick={() => setShowModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader entrada={tipoMovimento === 'entrada'}>
              <h3>
                {tipoMovimento === 'entrada' ? (
                  <><ArrowUpCircle size={20} /> Registrar Entrada</>
                ) : (
                  <><ArrowDownCircle size={20} /> Registrar Saída</>
                )}
              </h3>
              <CloseBtn onClick={() => setShowModal(false)}>✕</CloseBtn>
            </ModalHeader>
            <ModalBody>
              <FormGrid>
                <FormGroup full>
                  <label>Item</label>
                  <select>
                    {estoqueItens.map(i => (
                      <option key={i.id}>{i.nome} ({i.unidade})</option>
                    ))}
                  </select>
                </FormGroup>
                <FormGroup>
                  <label>Quantidade</label>
                  <input type="number" placeholder="0" />
                </FormGroup>
                <FormGroup>
                  <label>Data</label>
                  <input type="date" defaultValue="2026-06-05" />
                </FormGroup>
                <FormGroup full>
                  <label>Motivo / Observação</label>
                  <input type="text" placeholder={tipoMovimento === 'entrada' ? 'Ex: Compra, transferência…' : 'Ex: Aplicação talhão 1…'} />
                </FormGroup>
                {tipoMovimento === 'entrada' && (
                  <FormGroup full>
                    <label>NF-e Vinculada (opcional)</label>
                    <input type="text" placeholder="Ex: NF-e 001.245" />
                  </FormGroup>
                )}
              </FormGrid>
              <ModalActions>
                <CancelBtn onClick={() => setShowModal(false)}>Cancelar</CancelBtn>
                <SubmitBtn entrada={tipoMovimento === 'entrada'} onClick={() => { alert(`Movimentação registrada (demo)`); setShowModal(false) }}>
                  {tipoMovimento === 'entrada' ? 'Confirmar Entrada' : 'Confirmar Saída'}
                </SubmitBtn>
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
  flex-wrap: wrap; gap: 16px; margin-bottom: 24px;
`
const PageTitle = styled.h1`font-size: 1.5rem; font-weight: 800; color: #1A1A2E;`
const PageSub = styled.p`font-size: 0.875rem; color: #6C757D; margin-top: 2px;`
const HeaderActions = styled.div`display: flex; gap: 10px;`
const MovBtn = styled.button`
  display: inline-flex; align-items: center; gap: 7px;
  font-weight: 600; font-size: 0.875rem; padding: 9px 18px; border-radius: 9px; cursor: pointer;
  transition: all 0.2s;
  background: ${({ entrada }) => entrada ? 'linear-gradient(135deg,#2D6A4F,#40916C)' : '#fff'};
  color: ${({ entrada }) => entrada ? '#fff' : '#E63946'};
  border: ${({ entrada }) => entrada ? 'none' : '1.5px solid #E63946'};
  box-shadow: ${({ entrada }) => entrada ? '0 4px 12px rgba(45,106,79,0.3)' : 'none'};
  &:hover { opacity: 0.88; }
`

const AlertBanner = styled.div`
  display: flex; align-items: center; gap: 12px;
  background: #FFFBEA; border: 1px solid #FDE68A; border-radius: 10px;
  padding: 14px 16px; margin-bottom: 20px;
  span { font-size: 0.875rem; color: #92400E; flex: 1; }
  strong { font-weight: 700; }
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
const Abas = styled.div`display: flex; gap: 6px;`
const AbaBtn = styled.button`
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 8px; font-size: 0.8125rem; font-weight: 600;
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
const NomeItem = styled.span`font-weight: 600; font-size: 0.875rem; color: #1A1A2E;`
const CategoriaBadge = styled.span`
  background: #F1F3F5; color: #495057; font-size: 0.75rem;
  font-weight: 600; padding: 4px 10px; border-radius: 6px;
`
const QuantWrap = styled.div`
  display: flex; align-items: baseline; gap: 4px;
  strong { font-size: 0.9375rem; font-weight: 700; color: ${({ baixo }) => baixo ? '#E63946' : '#1A1A2E'}; }
  span { font-size: 0.72rem; color: #6C757D; }
`
const ValorTotal = styled.span`font-weight: 700; color: #2D6A4F; font-size: 0.9rem;`
const StatusBadge = styled.span`
  display: inline-flex; align-items: center; gap: 5px;
  background: ${({ bg }) => bg}; color: ${({ color }) => color};
  font-size: 0.75rem; font-weight: 600; padding: 4px 10px; border-radius: 99px;
`
const TipoBadge = styled.span`
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 0.78rem; font-weight: 600; padding: 4px 10px; border-radius: 99px;
  background: ${({ entrada }) => entrada ? '#E9F5EE' : '#FFF0EE'};
  color: ${({ entrada }) => entrada ? '#2D6A4F' : '#E63946'};
`
const NfeBadge = styled.span`
  font-size: 0.75rem; font-weight: 600; color: #4C6EF5;
  background: #EEF2FF; padding: 3px 8px; border-radius: 6px; font-family: monospace;
`

/* Modal */
const Overlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 24px;
`
const Modal = styled.div`
  background: #fff; border-radius: 16px; width: 100%; max-width: 500px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.2); overflow: hidden;
`
const ModalHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px; border-bottom: 1px solid #F1F3F5;
  background: ${({ entrada }) => entrada ? '#E9F5EE' : '#FFF0EE'};
  h3 { font-size: 1rem; font-weight: 700; color: #1A1A2E; display: flex; align-items: center; gap: 8px; }
`
const CloseBtn = styled.button`color: #ADB5BD; cursor: pointer; font-size: 1.1rem; &:hover { color: #1A1A2E; }`
const ModalBody = styled.div`padding: 24px;`
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
const ModalActions = styled.div`display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px;`
const CancelBtn = styled.button`
  padding: 10px 20px; border-radius: 8px; font-size: 0.875rem; font-weight: 500;
  color: #495057; background: #F1F3F5; cursor: pointer;
  &:hover { background: #DEE2E6; }
`
const SubmitBtn = styled.button`
  padding: 10px 22px; border-radius: 8px; font-size: 0.875rem; font-weight: 600;
  color: #fff; cursor: pointer;
  background: ${({ entrada }) => entrada ? 'linear-gradient(135deg,#2D6A4F,#40916C)' : 'linear-gradient(135deg,#E63946,#FF6B6B)'};
  &:hover { opacity: 0.9; }
`
