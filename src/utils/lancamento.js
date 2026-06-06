export const SLUG_TO_NOME = {
  insumos: 'Insumos',
  maquinario: 'Maquinário',
  mao_de_obra: 'Mão de Obra',
  combustivel: 'Combustível',
  arrendamento: 'Arrendamento',
  receitas: 'Receitas',
  outros: 'Outros',
}

export function normalizar(l) {
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
