import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Plus, Search, Filter, X, Trash2 } from 'lucide-react'
import { financeiro } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const CATEGORIAS = [
  { slug: 'insumos',      nome: 'Insumos' },
  { slug: 'maquinario',   nome: 'Maquinário' },
  { slug: 'mao_de_obra',  nome: 'Mão de Obra' },
  { slug: 'combustivel',  nome: 'Combustível' },
  { slug: 'arrendamento', nome: 'Arrendamento' },
  { slug: 'receitas',     nome: 'Receitas' },
  { slug: 'outros',       nome: 'Outros' },
]

const SLUG_TO_NOME = Object.fromEntries(CATEGORIAS.map(c => [c.slug, c.nome]))

function normalizar(l) {
  return {
    _id: l._id,
    descricao: l.description,
    categoria: SLUG_TO_NOME[l.category] ?? l.category,
    valor: l.value,
    data: l.date,
    tipo: l.type === 'receita' ? 'entrada' : 'saida',
    origem: l.origin,
  }
}

const fmt = (v) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Gastos() {
  const { user } = useAuth()
  const [lista, setLista] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [busca, setBusca] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('Todas')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [modalAberto, setModalAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [novoGasto, setNovoGasto] = useState({
    descricao: '', categoria: 'insumos', valor: '', data: '', tipo: 'saida',
  })

  const carregarLancamentos = useCallback(async () => {
    if (!user?.slug) return
    try {
      setCarregando(true)
      setErro(null)
      const res = await financeiro.listar(user.slug)
      setLista((res.data ?? []).map(normalizar))
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }, [user?.slug])

  useEffect(() => { carregarLancamentos() }, [carregarLancamentos])

  const listaFiltrada = lista.filter((g) => {
    const matchBusca = (g.descricao ?? '').toLowerCase().includes(busca.toLowerCase())
    const matchCategoria = filtroCategoria === 'Todas' || g.categoria === filtroCategoria
    const matchTipo = filtroTipo === 'todos' || g.tipo === filtroTipo
    return matchBusca && matchCategoria && matchTipo
  })

  async function handleAdicionarGasto(e) {
    e.preventDefault()
    setSalvando(true)
    try {
      const payload = {
        type: novoGasto.tipo === 'entrada' ? 'receita' : 'despesa',
        description: novoGasto.descricao,
        value: parseFloat(novoGasto.valor),
        date: novoGasto.data,
        category: novoGasto.categoria,
        origin: 'web',
      }
      const res = await financeiro.criar(user.slug, payload)
      setLista(prev => [normalizar(res?.data ?? res), ...prev])
      setModalAberto(false)
      setNovoGasto({ descricao: '', categoria: 'insumos', valor: '', data: '', tipo: 'saida' })
    } catch (e) {
      alert(e.message ?? 'Erro ao salvar lançamento')
    } finally {
      setSalvando(false)
    }
  }

  async function handleRemover(id) {
    if (!confirm('Remover este lançamento?')) return
    try {
      await financeiro.remover(user.slug, id)
      setLista(prev => prev.filter(g => g._id !== id))
    } catch (e) {
      alert(e.message ?? 'Erro ao remover lançamento')
    }
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Gastos</PageTitle>
          <PageSub>Todas as movimentações financeiras</PageSub>
        </div>
        <AddBtn onClick={() => setModalAberto(true)}>
          <Plus size={18} />
          Novo lançamento
        </AddBtn>
      </PageHeader>

      <Filters>
        <SearchBox>
          <Search size={16} color="#ADB5BD" />
          <SearchInput
            placeholder="Buscar lançamento..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </SearchBox>

        <FilterGroup>
          <Filter size={15} color="#6C757D" />
          <Select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
            <option>Todas</option>
            {CATEGORIAS.map(c => <option key={c.slug}>{c.nome}</option>)}
          </Select>
        </FilterGroup>

        <TipoTabs>
          {['todos', 'saida', 'entrada'].map(t => (
            <TipoTab key={t} active={filtroTipo === t} onClick={() => setFiltroTipo(t)}>
              {t === 'todos' ? 'Todos' : t === 'saida' ? 'Despesas' : 'Receitas'}
            </TipoTab>
          ))}
        </TipoTabs>
      </Filters>

      {erro && <ErroMsg>{erro}</ErroMsg>}

      <Table>
        <thead>
          <tr>
            <Th>Descrição</Th>
            <Th>Categoria</Th>
            <Th>Data</Th>
            <Th>Origem</Th>
            <Th align="right">Valor</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {carregando ? (
            <tr>
              <Td colSpan={6} style={{ textAlign: 'center', color: '#ADB5BD', padding: '32px' }}>
                Carregando...
              </Td>
            </tr>
          ) : listaFiltrada.length === 0 ? (
            <tr>
              <Td colSpan={6} style={{ textAlign: 'center', color: '#ADB5BD', padding: '32px' }}>
                Nenhum lançamento encontrado
              </Td>
            </tr>
          ) : listaFiltrada.map(g => (
            <Tr key={g._id}>
              <Td>{g.descricao}</Td>
              <Td>
                <CatBadge>{g.categoria}</CatBadge>
              </Td>
              <Td>{g.data ? new Date(g.data).toLocaleDateString('pt-BR') : '—'}</Td>
              <Td>
                <OrigemBadge whatsapp={g.origem === 'whatsapp'}>
                  {g.origem === 'whatsapp' ? 'WhatsApp' : 'Web'}
                </OrigemBadge>
              </Td>
              <Td align="right">
                <Valor entrada={g.tipo === 'entrada'}>
                  {g.tipo === 'entrada' ? '+' : '-'} {g.valor != null ? fmt(g.valor) : '—'}
                </Valor>
              </Td>
              <Td>
                <DeleteBtn onClick={() => handleRemover(g._id)} title="Remover">
                  <Trash2 size={15} />
                </DeleteBtn>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>

      {modalAberto && (
        <ModalOverlay onClick={() => setModalAberto(false)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Novo lançamento</ModalTitle>
              <CloseBtn onClick={() => setModalAberto(false)}><X size={20} /></CloseBtn>
            </ModalHeader>

            <ModalForm onSubmit={handleAdicionarGasto}>
              <TipoSelector>
                {['saida', 'entrada'].map(t => (
                  <TipoOpt
                    key={t}
                    type="button"
                    active={novoGasto.tipo === t}
                    entrada={t === 'entrada'}
                    onClick={() => setNovoGasto({ ...novoGasto, tipo: t })}
                  >
                    {t === 'saida' ? 'Despesa' : 'Receita'}
                  </TipoOpt>
                ))}
              </TipoSelector>

              <ModalField>
                <ModalLabel>Descrição</ModalLabel>
                <ModalInput
                  placeholder="Ex: Herbicida Glifosato"
                  value={novoGasto.descricao}
                  onChange={e => setNovoGasto({ ...novoGasto, descricao: e.target.value })}
                  required
                />
              </ModalField>

              <TwoCols>
                <ModalField>
                  <ModalLabel>Valor (R$)</ModalLabel>
                  <ModalInput
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0,00"
                    value={novoGasto.valor}
                    onChange={e => setNovoGasto({ ...novoGasto, valor: e.target.value })}
                    required
                  />
                </ModalField>
                <ModalField>
                  <ModalLabel>Data</ModalLabel>
                  <ModalInput
                    type="date"
                    value={novoGasto.data}
                    onChange={e => setNovoGasto({ ...novoGasto, data: e.target.value })}
                    required
                  />
                </ModalField>
              </TwoCols>

              <ModalField>
                <ModalLabel>Categoria</ModalLabel>
                <ModalSelect
                  value={novoGasto.categoria}
                  onChange={e => setNovoGasto({ ...novoGasto, categoria: e.target.value })}
                >
                  {CATEGORIAS.map(c => <option key={c.slug} value={c.slug}>{c.nome}</option>)}
                </ModalSelect>
              </ModalField>

              <ModalActions>
                <CancelBtn type="button" onClick={() => setModalAberto(false)}>Cancelar</CancelBtn>
                <SaveBtn type="submit" disabled={salvando}>
                  {salvando ? 'Salvando...' : 'Salvar lançamento'}
                </SaveBtn>
              </ModalActions>
            </ModalForm>
          </ModalCard>
        </ModalOverlay>
      )}
    </Page>
  )
}

const Page = styled.div`
  padding: 32px;
  max-width: 1100px;
`

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
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

const AddBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #2D6A4F;
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: #1B4332;
  }
`

const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1.5px solid #DEE2E6;
  border-radius: 8px;
  padding: 9px 14px;
  flex: 1;
  min-width: 200px;
`

const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 0.9rem;
  color: #1A1A2E;
  width: 100%;
  background: transparent;

  &::placeholder { color: #ADB5BD; }
`

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border: 1.5px solid #DEE2E6;
  border-radius: 8px;
  padding: 9px 12px;
`

const Select = styled.select`
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: #1A1A2E;
  background: transparent;
  cursor: pointer;
`

const TipoTabs = styled.div`
  display: flex;
  gap: 4px;
  background: #F1F3F5;
  border-radius: 8px;
  padding: 4px;
`

const TipoTab = styled.button`
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ active }) => active ? '#1A1A2E' : '#6C757D'};
  background: ${({ active }) => active ? '#fff' : 'transparent'};
  box-shadow: ${({ active }) => active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};
  transition: all 0.15s;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
`

const Th = styled.th`
  text-align: ${({ align }) => align || 'left'};
  padding: 12px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6C757D;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: #F8F9FA;
  border-bottom: 1px solid #DEE2E6;
`

const Tr = styled.tr`
  &:hover { background: #FAFBFC; }
  &:not(:last-child) { border-bottom: 1px solid #F1F3F5; }
`

const Td = styled.td`
  padding: 13px 16px;
  font-size: 0.9rem;
  color: #1A1A2E;
  text-align: ${({ align }) => align || 'left'};
`

const CatBadge = styled.span`
  background: #F1F3F5;
  color: #495057;
  font-size: 0.78rem;
  padding: 3px 9px;
  border-radius: 99px;
`

const OrigemBadge = styled.span`
  background: ${({ whatsapp }) => whatsapp ? '#E7FBEF' : '#EEF2FF'};
  color: ${({ whatsapp }) => whatsapp ? '#25D366' : '#4C6EF5'};
  font-size: 0.78rem;
  font-weight: 500;
  padding: 3px 9px;
  border-radius: 99px;
`

const Valor = styled.span`
  font-weight: 600;
  color: ${({ entrada }) => entrada ? '#40916C' : '#E63946'};
`

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
`

const ModalCard = styled.div`
  background: #fff;
  border-radius: 14px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #F1F3F5;
`

const ModalTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1A1A2E;
`

const CloseBtn = styled.button`
  color: #6C757D;
  display: flex;
  &:hover { color: #1A1A2E; }
`

const ModalForm = styled.form`
  padding: 20px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const TipoSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`

const TipoOpt = styled.button`
  padding: 10px;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  border: 2px solid ${({ active, entrada }) =>
    active ? (entrada ? '#40916C' : '#E63946') : '#DEE2E6'};
  color: ${({ active, entrada }) =>
    active ? (entrada ? '#40916C' : '#E63946') : '#6C757D'};
  background: ${({ active, entrada }) =>
    active ? (entrada ? '#E9F5EE' : '#FFF0EE') : '#fff'};
  transition: all 0.15s;
`

const TwoCols = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

const ModalField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const ModalLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1A1A2E;
`

const ModalInput = styled.input`
  padding: 10px 13px;
  border: 1.5px solid #DEE2E6;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #1A1A2E;
  outline: none;
  transition: border-color 0.2s;

  &:focus { border-color: #2D6A4F; }
  &::placeholder { color: #ADB5BD; }
`

const ModalSelect = styled.select`
  padding: 10px 13px;
  border: 1.5px solid #DEE2E6;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #1A1A2E;
  outline: none;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus { border-color: #2D6A4F; }
`

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
`

const CancelBtn = styled.button`
  flex: 1;
  padding: 11px;
  border-radius: 8px;
  border: 1.5px solid #DEE2E6;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #6C757D;
  background: #fff;
  transition: all 0.15s;

  &:hover { border-color: #ADB5BD; color: #1A1A2E; }
`

const SaveBtn = styled.button`
  flex: 2;
  padding: 11px;
  border-radius: 8px;
  background: #2D6A4F;
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 600;
  transition: background 0.2s;

  &:hover:not(:disabled) { background: #1B4332; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`

const ErroMsg = styled.p`
  color: #E63946;
  font-size: 0.875rem;
  margin-bottom: 12px;
`

const DeleteBtn = styled.button`
  color: #ADB5BD;
  display: flex;
  align-items: center;
  transition: color 0.15s;

  &:hover { color: #E63946; }
`
