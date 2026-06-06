# AgroFinance — Controle Financeiro para Produtores Rurais

Plataforma de gestão financeira voltada para produtores rurais de pequeno e médio porte, combinando uma interface web com interação via WhatsApp e inteligência artificial.

## Visão Geral

O produtor rural interage pelo WhatsApp para consultar e registrar seus gastos financeiros no dia a dia. As informações são visualizadas em dashboards na aplicação web, onde também é feito o login e cadastro.

## Funcionalidades

### Web
- Cadastro e login com número de telefone (usado para identificar o usuário no WhatsApp)
- Dashboard com gráficos e relatórios financeiros
- Visualização detalhada dos gastos e receitas

### Emissão de Notas Fiscais
- Emissão de NF-e (Nota Fiscal Eletrônica de produtos) diretamente pela plataforma
- Emissão de NFS-e (Nota Fiscal de Serviços Eletrônica)
- Transmissão automática à SEFAZ com retorno de status (autorizada, em processamento, cancelada)
- Download do XML e DANFE das notas autorizadas
- Histórico completo de notas emitidas com filtros por status e período

### Integração com SEFAZ
- Monitoramento automático do CNPJ do produtor na base da SEFAZ
- Recebimento automático de todas as NF-e emitidas para o produtor (receitas e despesas)
- Importação automática das notas como lançamentos financeiros, sem necessidade de entrada manual
- Painel de aprovação para notas pendentes de confirmação
- Indicador de status da conexão com o ambiente oficial da SEFAZ
- Download de XML das notas recebidas

### Controle de Estoque da Propriedade
- Cadastro de insumos, combustíveis, sementes, defensivos e demais materiais
- Registro de entradas (com vínculo automático à NF-e recebida) e saídas de estoque
- Alertas automáticos quando o estoque atinge o nível mínimo configurado
- Histórico de movimentações com data, motivo e NF-e vinculada
- Cálculo automático do valor total em estoque por item e categoria
- Visualização por local de armazenamento (galpão, silo, tanque, etc.)

### WhatsApp
- Inserção de dados financeiros por mensagem
- Consulta de gastos, saldos e relatórios
- Respostas da IA sobre:
  - Variação de preços de commodities (ex: soja, milho)
  - Previsão do tempo
  - Alertas de tempestade e eventos climáticos
  - Outras informações relevantes para o produtor rural

## Arquitetura

- **Frontend Web**: dashboard, autenticação, emissão de NF-e e controle de estoque
- **Backend**: API que orquestra as integrações com WhatsApp, IA e SEFAZ
- **IA**: processa as mensagens recebidas via WhatsApp e gera respostas contextualizadas
- **WhatsApp**: canal principal de interação do produtor com o sistema
- **SEFAZ**: integração via Web Service para emissão e recebimento de NF-e em tempo real

## Rotas da Aplicação

| Rota | Descrição |
|------|-----------|
| `/dashboard` | Visão geral financeira, gráficos e cotações |
| `/gastos` | Lançamentos de receitas e despesas |
| `/relatorios` | Relatórios por safra e categoria |
| `/notas-fiscais` | Emissão e consulta de NF-e / NFS-e |
| `/sefaz` | NF-e recebidas e status de integração SEFAZ |
| `/estoque` | Controle de estoque da propriedade |
| `/configuracoes` | Dados da fazenda e preferências |

## Objetivo

Facilitar a gestão financeira de produtores rurais de pequeno e médio porte, tornando o controle de gastos, emissão fiscal e estoque acessíveis e práticos através de ferramentas que o produtor já usa no dia a dia.

# 22-amigosdavanderleia
