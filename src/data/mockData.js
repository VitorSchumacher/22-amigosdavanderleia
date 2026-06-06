export const mockUser = {
  id: 1,
  name: 'João Aparecido Silva',
  email: 'joao.silva@fazenda.com',
  phone: '(65) 99812-3456',
  fazenda: 'Fazenda Boa Esperança',
  cidade: 'Sorriso - MT',
  avatar: null,
}

export const categorias = [
  { id: 1, nome: 'Insumos', cor: '#2D6A4F', icone: 'sprout' },
  { id: 2, nome: 'Maquinário', cor: '#F4A261', icone: 'tractor' },
  { id: 3, nome: 'Mão de Obra', cor: '#457B9D', icone: 'users' },
  { id: 4, nome: 'Combustível', cor: '#E63946', icone: 'fuel' },
  { id: 5, nome: 'Arrendamento', cor: '#7B2D8B', icone: 'map' },
  { id: 6, nome: 'Receitas', cor: '#40916C', icone: 'trending-up' },
]

export const gastos = [
  { id: 1, descricao: 'Herbicida Glifosato', categoria: 'Insumos', valor: 4800.0, data: '2026-05-28', tipo: 'saida', origem: 'whatsapp' },
  { id: 2, descricao: 'Adubo NPK 300 sacas', categoria: 'Insumos', valor: 12500.0, data: '2026-05-25', tipo: 'saida', origem: 'whatsapp' },
  { id: 3, descricao: 'Manutenção Colheitadeira', categoria: 'Maquinário', valor: 3200.0, data: '2026-05-22', tipo: 'saida', origem: 'web' },
  { id: 4, descricao: 'Diesel 2.000 litros', categoria: 'Combustível', valor: 7600.0, data: '2026-05-20', tipo: 'saida', origem: 'whatsapp' },
  { id: 5, descricao: 'Pagamento diaristas colheita', categoria: 'Mão de Obra', valor: 5400.0, data: '2026-05-18', tipo: 'saida', origem: 'web' },
  { id: 6, descricao: 'Venda Soja 200 sacas', categoria: 'Receitas', valor: 29000.0, data: '2026-05-15', tipo: 'entrada', origem: 'web' },
  { id: 7, descricao: 'Arrendamento talhão 3', categoria: 'Arrendamento', valor: 8000.0, data: '2026-05-10', tipo: 'saida', origem: 'whatsapp' },
  { id: 8, descricao: 'Inseticida Engeo Pleno', categoria: 'Insumos', valor: 2100.0, data: '2026-05-08', tipo: 'saida', origem: 'whatsapp' },
  { id: 9, descricao: 'Diesel 1.500 litros', categoria: 'Combustível', valor: 5700.0, data: '2026-04-28', tipo: 'saida', origem: 'whatsapp' },
  { id: 10, descricao: 'Venda Milho 500 sacas', categoria: 'Receitas', valor: 18500.0, data: '2026-04-20', tipo: 'entrada', origem: 'web' },
  { id: 11, descricao: 'Semente Soja 80 sacas', categoria: 'Insumos', valor: 16000.0, data: '2026-04-15', tipo: 'saida', origem: 'web' },
  { id: 12, descricao: 'Reparo trator John Deere', categoria: 'Maquinário', valor: 4500.0, data: '2026-04-10', tipo: 'saida', origem: 'web' },
]

export const evolucaoMensal = [
  { mes: 'Jan', receitas: 18000, despesas: 14200 },
  { mes: 'Fev', receitas: 21000, despesas: 16800 },
  { mes: 'Mar', receitas: 15500, despesas: 22400 },
  { mes: 'Abr', receitas: 38500, despesas: 30200 },
  { mes: 'Mai', receitas: 47500, despesas: 43600 },
  { mes: 'Jun', receitas: 0, despesas: 0 },
]

export const gastosPorCategoria = [
  { name: 'Insumos', value: 35400, fill: '#2D6A4F' },
  { name: 'Maquinário', value: 7700, fill: '#F4A261' },
  { name: 'Mão de Obra', value: 5400, fill: '#457B9D' },
  { name: 'Combustível', value: 13300, fill: '#E63946' },
  { name: 'Arrendamento', value: 8000, fill: '#7B2D8B' },
]

export const resumoFinanceiro = {
  saldoAtual: 18900.0,
  totalEntradas: 47500.0,
  totalSaidas: 43600.0,
  variacaoMes: 12.4,
}

export const precosCommodities = [
  { cultura: 'Soja', preco: 145.5, unidade: 'R$/sc', variacao: +2.3 },
  { cultura: 'Milho', preco: 37.8, unidade: 'R$/sc', variacao: -0.8 },
  { cultura: 'Algodão', preco: 89.2, unidade: 'R$/@ ', variacao: +1.1 },
]
