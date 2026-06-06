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

// ── NOTAS FISCAIS ─────────────────────────────────────────────────
export const notasFiscais = [
  {
    id: 1, numero: 'NF-e 000.001', tipo: 'NF-e', status: 'autorizada',
    destinatario: 'Cooperativa Agrícola Sorriso', cnpj: '12.345.678/0001-99',
    valor: 29000.0, data: '2026-05-15', chave: '35260512345678000199550010000000011234567890',
    descricao: 'Venda de Soja — 200 sacas', categoria: 'Receita',
  },
  {
    id: 2, numero: 'NF-e 000.002', tipo: 'NF-e', status: 'autorizada',
    destinatario: 'Grãos do Centro Oeste Ltda', cnpj: '98.765.432/0001-11',
    valor: 18500.0, data: '2026-04-20', chave: '35260598765432000111550010000000021234567890',
    descricao: 'Venda de Milho — 500 sacas', categoria: 'Receita',
  },
  {
    id: 3, numero: 'NF-e 000.003', tipo: 'NF-e', status: 'em_processamento',
    destinatario: 'Fazenda Santa Luzia', cnpj: '11.222.333/0001-44',
    valor: 8400.0, data: '2026-06-01', chave: '',
    descricao: 'Venda de Soja — 60 sacas', categoria: 'Receita',
  },
  {
    id: 4, numero: 'NFS-e 000.001', tipo: 'NFS-e', status: 'autorizada',
    destinatario: 'João Aparecido Silva', cnpj: '000.000.000/0000-00',
    valor: 3200.0, data: '2026-05-22', chave: '35260512345678000199550020000000011234567891',
    descricao: 'Serviço de manutenção — Colheitadeira', categoria: 'Despesa',
  },
  {
    id: 5, numero: 'NF-e 000.004', tipo: 'NF-e', status: 'cancelada',
    destinatario: 'Distribuidora Agro MT', cnpj: '55.666.777/0001-22',
    valor: 5600.0, data: '2026-04-05', chave: '35260555666777000122550010000000041234567890',
    descricao: 'Venda de Soja — 40 sacas (cancelado)', categoria: 'Receita',
  },
]

// ── SEFAZ / NF-e RECEBIDAS ────────────────────────────────────────
export const nfeRecebidas = [
  {
    id: 1, numero: 'NF-e 001.245', emitente: 'Agro Insumos Pantanal Ltda',
    cnpjEmitente: '22.333.444/0001-55', valor: 12500.0, data: '2026-05-25',
    status: 'importada', tipo: 'despesa', categoria: 'Insumos',
    descricao: 'Adubo NPK 300 sacas', chave: '35260522333444000155550010000012451234567890',
  },
  {
    id: 2, numero: 'NF-e 003.891', emitente: 'Posto Combustíveis Sorriso',
    cnpjEmitente: '44.555.666/0001-77', valor: 7600.0, data: '2026-05-20',
    status: 'importada', tipo: 'despesa', categoria: 'Combustível',
    descricao: 'Diesel S10 — 2.000 litros', chave: '35260544555666000177550010000038911234567890',
  },
  {
    id: 3, numero: 'NF-e 000.712', emitente: 'AgroTech Defensivos MT',
    cnpjEmitente: '66.777.888/0001-99', valor: 4800.0, data: '2026-05-28',
    status: 'importada', tipo: 'despesa', categoria: 'Insumos',
    descricao: 'Herbicida Glifosato 200L', chave: '35260566777888000199550010000007121234567890',
  },
  {
    id: 4, numero: 'NF-e 005.002', emitente: 'Sementes Brasil S/A',
    cnpjEmitente: '88.999.000/0001-11', valor: 16000.0, data: '2026-04-15',
    status: 'importada', tipo: 'despesa', categoria: 'Insumos',
    descricao: 'Semente Soja certificada — 80 sacas', chave: '35260588999000000111550010000050021234567890',
  },
  {
    id: 5, numero: 'NF-e 002.190', emitente: 'Mecânica Agrícola Sorriso',
    cnpjEmitente: '11.000.222/0001-33', valor: 4500.0, data: '2026-04-10',
    status: 'pendente', tipo: 'despesa', categoria: 'Maquinário',
    descricao: 'Reparo trator John Deere 6110J', chave: '35260511000222000133550010000021901234567890',
  },
  {
    id: 6, numero: 'NF-e 001.005', emitente: 'Distribuidora Inseticidas Central',
    cnpjEmitente: '33.444.555/0001-66', valor: 2100.0, data: '2026-05-08',
    status: 'pendente', tipo: 'despesa', categoria: 'Insumos',
    descricao: 'Inseticida Engeo Pleno 5L', chave: '35260533444555000166550010000010051234567890',
  },
]

// ── ESTOQUE ───────────────────────────────────────────────────────
export const estoqueItens = [
  {
    id: 1, nome: 'Herbicida Glifosato', unidade: 'L', categoria: 'Defensivos',
    quantidade: 120, minimo: 50, precoUnitario: 24.0,
    ultimaEntrada: '2026-05-28', localizacao: 'Galpão A',
  },
  {
    id: 2, nome: 'Adubo NPK 04-14-08', unidade: 'sc', categoria: 'Fertilizantes',
    quantidade: 180, minimo: 100, precoUnitario: 85.0,
    ultimaEntrada: '2026-05-25', localizacao: 'Galpão B',
  },
  {
    id: 3, nome: 'Inseticida Engeo Pleno', unidade: 'L', categoria: 'Defensivos',
    quantidade: 18, minimo: 20, precoUnitario: 420.0,
    ultimaEntrada: '2026-05-08', localizacao: 'Galpão A',
  },
  {
    id: 4, nome: 'Semente Soja RR2', unidade: 'sc', categoria: 'Sementes',
    quantidade: 45, minimo: 80, precoUnitario: 200.0,
    ultimaEntrada: '2026-04-15', localizacao: 'Silo',
  },
  {
    id: 5, nome: 'Diesel S10', unidade: 'L', categoria: 'Combustíveis',
    quantidade: 3400, minimo: 1000, precoUnitario: 3.8,
    ultimaEntrada: '2026-05-20', localizacao: 'Tanque',
  },
  {
    id: 6, nome: 'Óleo Hidráulico 20W50', unidade: 'L', categoria: 'Lubrificantes',
    quantidade: 60, minimo: 30, precoUnitario: 18.5,
    ultimaEntrada: '2026-04-02', localizacao: 'Oficina',
  },
  {
    id: 7, nome: 'Fungicida Fox Xpro', unidade: 'L', categoria: 'Defensivos',
    quantidade: 8, minimo: 15, precoUnitario: 380.0,
    ultimaEntrada: '2026-03-18', localizacao: 'Galpão A',
  },
  {
    id: 8, nome: 'Calcário Dolomítico', unidade: 't', categoria: 'Corretivos',
    quantidade: 24, minimo: 10, precoUnitario: 120.0,
    ultimaEntrada: '2026-04-28', localizacao: 'Pátio',
  },
]

export const movimentacoesEstoque = [
  { id: 1, item: 'Herbicida Glifosato', tipo: 'entrada', quantidade: 200, data: '2026-05-28', motivo: 'Compra', nfe: 'NF-e 000.712' },
  { id: 2, item: 'Herbicida Glifosato', tipo: 'saida', quantidade: 80, data: '2026-05-29', motivo: 'Aplicação talhão 1 e 2', nfe: null },
  { id: 3, item: 'Adubo NPK 04-14-08', tipo: 'entrada', quantidade: 300, data: '2026-05-25', motivo: 'Compra', nfe: 'NF-e 001.245' },
  { id: 4, item: 'Adubo NPK 04-14-08', tipo: 'saida', quantidade: 120, data: '2026-05-26', motivo: 'Adubação plantio soja', nfe: null },
  { id: 5, item: 'Diesel S10', tipo: 'entrada', quantidade: 2000, data: '2026-05-20', motivo: 'Compra', nfe: 'NF-e 003.891' },
  { id: 6, item: 'Diesel S10', tipo: 'saida', quantidade: 600, data: '2026-05-21', motivo: 'Plantio soja — tratores', nfe: null },
  { id: 7, item: 'Inseticida Engeo Pleno', tipo: 'entrada', quantidade: 20, data: '2026-05-08', motivo: 'Compra', nfe: 'NF-e 001.005' },
  { id: 8, item: 'Inseticida Engeo Pleno', tipo: 'saida', quantidade: 12, data: '2026-05-10', motivo: 'Pulverização talhão 3', nfe: null },
]
