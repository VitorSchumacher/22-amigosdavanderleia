import { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  Package, AlertTriangle, TrendingDown, TrendingUp,
  Plus, Search, ArrowUpCircle, ArrowDownCircle, History,
} from 'lucide-react'
import { estoque } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const fmtDate = (d) => new Date(d).toLocaleDateString('pt-BR')

const CATEGORIAS = ['defensivos', 'fertilizantes', 'sementes', 'combustivel', 'outros']

export default function Estoque() {
  const { user } = useAuth()
  const [itens, setItens] = useState([])
  const [movimentacoes, setMovimentacoes] = useState([])
  const [resumo, setResumo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [aba, setAba] = useState('itens')

  const [showMovModal, setShowMovModal] = useState(false)
  const [tipoMovimento, setTipoMovimento] = useState('entrada')
  const [movForm, setMovForm] = useState({ itemId: '', quantidade: '', motivo: '' })
  const [movSubmitting, setMovSubmitting] = useState(false)
  const [movError, setMovError] = useState('')

  const [showNovoModal, setShowNovoModal] = useState(false)
  const [novoForm, setNovoForm] = useState({
    nome: '', categoria: 'defensivos', quantidade: '',
    unidade: '', estoqueMinimo: '', descricao: '',
  })
  const [novoSubmitting, setNovoSubmitting] = useState(false)
  const [novoError, setNovoError] = useState('')

  useEffect(() => {
    if (!user?.slug) return
    loadAll()
  }, [user?.slug])

  async function loadAll() {
    setLoading(true)
    try {
      const [itensRes, movRes, resumoRes] = await Promise.all([
        estoque.listar(user.slug),
        estoque.movimentacoes(user.slug),
        estoque.resumo(user.slug),
      ])
      setItens(itensRes?.data ?? itensRes ?? [])
      setMovimentacoes(movRes?.data ?? movRes ?? [])
      setResumo(resumoRes?.data ?? resumoRes ?? null)
    } catch {
      // keep empty state on error
    } finally {
      setLoading(false)
    }
  }

  const itensEmAlerta = itens.filter(i => i.emAlerta)

  const itensFiltrados = itens.filter((i) =>
    i.nome.toLowerCase().includes(busca.toLowerCase()) ||
    i.categoria.toLowerCase().includes(busca.toLowerCase())
  )

  const movFiltradas = movimentacoes.filter((m) =>
    (m.itemId?.nome ?? '').toLowerCase().includes(busca.toLowerCase())
  )

  function statusEstoque(item) {
    if (item.emAlerta) return { label: 'Estoque Baixo', color: '#E63946', bg: '#FFF0EE' }
    if (item.quantidade <= item.estoqueMinimo * 1.5) return { label: 'Atenção', color: '#F4A261', bg: '#FFF8EE' }
    return { label: 'Normal', color: '#40916C', bg: '#E9F5EE' }
  }

  async function handleMovimentar(e) {
    e.preventDefault()
    setMovError('')
    if (!movForm.itemId || !movForm.quantidade || !movForm.motivo) {
      setMovError('Preencha todos os campos.')
      return
    }
    setMovSubmitting(true)
    try {
      await estoque.movimentar(user.slug, movForm.itemId, {
        tipo: tipoMovimento,
        quantidade: Number(movForm.quantidade),
        motivo: movForm.motivo,
      })
      setShowMovModal(false)
      setMovForm({ itemId: '', quantidade: '', motivo: '' })
      await loadAll()
    } catch (err) {
      setMovError(err.message ?? 'Erro ao registrar movimentação.')
    } finally {
      setMovSubmitting(false)
    }
  }

  async function handleNovoItem(e) {
    e.preventDefault()
    setNovoError('')
    if (!novoForm.nome || !novoForm.quantidade || !novoForm.unidade) {
      setNovoError('Preencha nome, quantidade e unidade.')
      return
    }
    setNovoSubmitting(true)
    try {
      await estoque.criar(user.slug, {
        ...novoForm,
        quantidade: Number(novoForm.quantidade),
        estoqueMinimo: Number(novoForm.estoqueMinimo) || 0,
      })
      setShowNovoModal(false)
      setNovoForm({ nome: '', categoria: 'defensivos', quantidade: '', unidade: '', estoqueMinimo: '', descricao: '' })
      await loadAll()
    } catch (err) {
      setNovoError(err.message ?? 'Erro ao criar item.')
    } finally {
      setNovoSubmitting(false)
    }
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Controle de Estoque</PageTitle>
          <PageSub>Insumos, combustíveis e materiais da propriedade</PageSub>
        </div>
        <HeaderActions>
          <NovoBtn onClick={() => setShowNovoModal(true)}>
            <Plus size={16} /> Novo Item
          </NovoBtn>
          <MovBtn entrada onClick={() => { setTipoMovimento('entrada'); setShowMovModal(true) }}>
            <ArrowUpCircle size={16} /> Entrada
          </MovBtn>
          <MovBtn onClick={() => { setTipoMovimento('saida'); setShowMovModal(true) }}>
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
            <SCardVal>{resumo?.totalItens ?? itens.length}</SCardVal>
          </SCardInfo>
        </SCard>
        <SCard accent="#E63946">
          <SCardIcon bg="#FFF0EE"><AlertTriangle size={20} color="#E63946" /></SCardIcon>
          <SCardInfo>
            <SCardLabel>Estoque Baixo</SCardLabel>
            <SCardVal>{resumo?.emAlerta ?? itensEmAlerta.length}</SCardVal>
          </SCardInfo>
        </SCard>
        <SCard accent="#40916C">
          <SCardIcon bg="#E9F5EE"><TrendingUp size={20} color="#40916C" /></SCardIcon>
          <SCardInfo>
            <SCardLabel>Entradas registradas</SCardLabel>
            <SCardVal>{movimentacoes.filter(m => m.tipo === 'entrada').length}</SCardVal>
          </SCardInfo>
        </SCard>
        <SCard accent="#2D6A4F">
          <SCardIcon bg="#E9F5EE"><TrendingDown size={20} color="#2D6A4F" /></SCardIcon>
          <SCardInfo>
            <SCardLabel>Saídas registradas</SCardLabel>
            <SCardVal>{movimentacoes.filter(m => m.tipo === 'saida').length}</SCardVal>
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

        {loading ? (
          <EmptyState>Carregando...</EmptyState>
        ) : aba === 'itens' ? (
          <Table>
            <thead>
              <tr>
                <Th>Item</Th>
                <Th>Categoria</Th>
                <Th>Quantidade</Th>
                <Th>Mínimo</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {itensFiltrados.length === 0 ? (
                <tr>
                  <Td colSpan={5} style={{ textAlign: 'center', color: '#ADB5BD' }}>
                    Nenhum item encontrado
                  </Td>
                </tr>
              ) : itensFiltrados.map((item) => {
                const st = statusEstoque(item)
                return (
                  <tr key={item._id}>
                    <Td>
                      <NomeItem>{item.nome}</NomeItem>
                      {item.descricao && <DescItem>{item.descricao}</DescItem>}
                    </Td>
                    <Td><CategoriaBadge>{item.categoria}</CategoriaBadge></Td>
                    <Td>
                      <QuantWrap baixo={item.emAlerta}>
                        <strong>{item.quantidade.toLocaleString('pt-BR')}</strong>
                        <span>{item.unidade}</span>
                      </QuantWrap>
                    </Td>
                    <Td style={{ fontSize: '0.85rem', color: '#6C757D' }}>
                      {item.estoqueMinimo} {item.unidade}
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
              </tr>
            </thead>
            <tbody>
              {movFiltradas.length === 0 ? (
                <tr>
                  <Td colSpan={5} style={{ textAlign: 'center', color: '#ADB5BD' }}>
                    Nenhuma movimentação encontrada
                  </Td>
                </tr>
              ) : movFiltradas.map((m) => (
                <tr key={m._id}>
                  <Td>
                    <NomeItem>{m.itemId?.nome ?? '—'}</NomeItem>
                    {m.itemId?.categoria && <DescItem>{m.itemId.categoria}</DescItem>}
                  </Td>
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
                      <span>{m.itemId?.unidade}</span>
                    </QuantWrap>
                  </Td>
                  <Td style={{ fontSize: '0.85rem', color: '#6C757D' }}>{fmtDate(m.data)}</Td>
                  <Td style={{ fontSize: '0.85rem', color: '#495057' }}>{m.motivo}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </TableCard>

      {showMovModal && (
        <Overlay onClick={() => setShowMovModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader entrada={tipoMovimento === 'entrada'}>
              <h3>
                {tipoMovimento === 'entrada' ? (
                  <><ArrowUpCircle size={20} /> Registrar Entrada</>
                ) : (
                  <><ArrowDownCircle size={20} /> Registrar Saída</>
                )}
              </h3>
              <CloseBtn onClick={() => setShowMovModal(false)}>✕</CloseBtn>
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleMovimentar}>
                <FormGrid>
                  <FormGroup full>
                    <label>Item</label>
                    <select
                      value={movForm.itemId}
                      onChange={(e) => setMovForm(f => ({ ...f, itemId: e.target.value }))}
                    >
                      <option value="">Selecione um item...</option>
                      {itens.map(i => (
                        <option key={i._id} value={i._id}>{i.nome} ({i.unidade})</option>
                      ))}
                    </select>
                  </FormGroup>
                  <FormGroup>
                    <label>Quantidade</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="0"
                      value={movForm.quantidade}
                      onChange={(e) => setMovForm(f => ({ ...f, quantidade: e.target.value }))}
                    />
                  </FormGroup>
                  <FormGroup full>
                    <label>Motivo / Observação</label>
                    <input
                      type="text"
                      placeholder={tipoMovimento === 'entrada' ? 'Ex: Compra, transferência…' : 'Ex: Aplicação talhão 1…'}
                      value={movForm.motivo}
                      onChange={(e) => setMovForm(f => ({ ...f, motivo: e.target.value }))}
                    />
                  </FormGroup>
                </FormGrid>
                {movError && <ErrorMsg>{movError}</ErrorMsg>}
                <ModalActions>
                  <CancelBtn type="button" onClick={() => setShowMovModal(false)}>Cancelar</CancelBtn>
                  <SubmitBtn type="submit" entrada={tipoMovimento === 'entrada'} disabled={movSubmitting}>
                    {movSubmitting ? 'Salvando…' : tipoMovimento === 'entrada' ? 'Confirmar Entrada' : 'Confirmar Saída'}
                  </SubmitBtn>
                </ModalActions>
              </form>
            </ModalBody>
          </Modal>
        </Overlay>
      )}

      {showNovoModal && (
        <Overlay onClick={() => setShowNovoModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader entrada>
              <h3><Plus size={20} /> Novo Item</h3>
              <CloseBtn onClick={() => setShowNovoModal(false)}>✕</CloseBtn>
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleNovoItem}>
                <FormGrid>
                  <FormGroup full>
                    <label>Nome</label>
                    <input
                      type="text"
                      placeholder="Ex: Roundup 4L"
                      value={novoForm.nome}
                      onChange={(e) => setNovoForm(f => ({ ...f, nome: e.target.value }))}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Categoria</label>
                    <select
                      value={novoForm.categoria}
                      onChange={(e) => setNovoForm(f => ({ ...f, categoria: e.target.value }))}
                    >
                      {CATEGORIAS.map(c => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </FormGroup>
                  <FormGroup>
                    <label>Unidade</label>
                    <input
                      type="text"
                      placeholder="Ex: L, sc, kg, t"
                      value={novoForm.unidade}
                      onChange={(e) => setNovoForm(f => ({ ...f, unidade: e.target.value }))}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Quantidade inicial</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={novoForm.quantidade}
                      onChange={(e) => setNovoForm(f => ({ ...f, quantidade: e.target.value }))}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Estoque mínimo</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={novoForm.estoqueMinimo}
                      onChange={(e) => setNovoForm(f => ({ ...f, estoqueMinimo: e.target.value }))}
                    />
                  </FormGroup>
                  <FormGroup full>
                    <label>Descrição (opcional)</label>
                    <input
                      type="text"
                      placeholder="Observações sobre o item"
                      value={novoForm.descricao}
                      onChange={(e) => setNovoForm(f => ({ ...f, descricao: e.target.value }))}
                    />
                  </FormGroup>
                </FormGrid>
                {novoError && <ErrorMsg>{novoError}</ErrorMsg>}
                <ModalActions>
                  <CancelBtn type="button" onClick={() => setShowNovoModal(false)}>Cancelar</CancelBtn>
                  <SubmitBtn type="submit" entrada disabled={novoSubmitting}>
                    {novoSubmitting ? 'Salvando…' : 'Cadastrar Item'}
                  </SubmitBtn>
                </ModalActions>
              </form>
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
const HeaderActions = styled.div`display: flex; gap: 10px; flex-wrap: wrap;`
const NovoBtn = styled.button`
  display: inline-flex; align-items: center; gap: 7px;
  font-weight: 600; font-size: 0.875rem; padding: 9px 18px; border-radius: 9px; cursor: pointer;
  transition: all 0.2s; background: #EEF2FF; color: #4C6EF5; border: none;
  &:hover { background: #E0E7FF; }
`
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
const EmptyState = styled.div`
  padding: 48px; text-align: center; color: #ADB5BD; font-size: 0.9rem;
`
const Table = styled.table`width: 100%; border-collapse: collapse;`
const Th = styled.th`
  text-align: left; padding: 12px 16px; font-size: 0.75rem;
  font-weight: 600; color: #6C757D; background: #F8F9FA; border-bottom: 1px solid #F1F3F5;
`
const Td = styled.td`padding: 14px 16px; border-bottom: 1px solid #F9FAFB; vertical-align: middle;`
const NomeItem = styled.span`font-weight: 600; font-size: 0.875rem; color: #1A1A2E; display: block;`
const DescItem = styled.span`font-size: 0.78rem; color: #ADB5BD;`
const CategoriaBadge = styled.span`
  background: #F1F3F5; color: #495057; font-size: 0.75rem;
  font-weight: 600; padding: 4px 10px; border-radius: 6px;
`
const QuantWrap = styled.div`
  display: flex; align-items: baseline; gap: 4px;
  strong { font-size: 0.9375rem; font-weight: 700; color: ${({ baixo }) => baixo ? '#E63946' : '#1A1A2E'}; }
  span { font-size: 0.72rem; color: #6C757D; }
`
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
const ErrorMsg = styled.p`
  font-size: 0.8125rem; color: #E63946; margin-top: 12px;
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
  color: #fff; cursor: pointer; disabled: opacity 0.6;
  background: ${({ entrada }) => entrada ? 'linear-gradient(135deg,#2D6A4F,#40916C)' : 'linear-gradient(135deg,#E63946,#FF6B6B)'};
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`
