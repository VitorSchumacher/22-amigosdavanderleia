# AgroFinance — Controle Financeiro para Produtores Rurais

Plataforma de gestão financeira voltada para produtores rurais de pequeno e médio porte, combinando uma interface web com interação via WhatsApp e inteligência artificial.

## Visão Geral

O produtor rural interage pelo WhatsApp para consultar e registrar seus gastos financeiros no dia a dia. As informações são visualizadas em dashboards na aplicação web, onde também é feito o login e cadastro.

## Funcionalidades

### Web
- Cadastro e login com número de telefone (usado para identificar o usuário no WhatsApp)
- Dashboard com gráficos e relatórios financeiros
- Visualização detalhada dos gastos e receitas

### WhatsApp
- Inserção de dados financeiros por mensagem
- Consulta de gastos, saldos e relatórios
- Respostas da IA sobre:
  - Variação de preços de commodities (ex: soja, milho)
  - Previsão do tempo
  - Alertas de tempestade e eventos climáticos
  - Outras informações relevantes para o produtor rural

## Arquitetura

- **Frontend Web**: dashboard e autenticação
- **Backend**: API que orquestra as integrações com WhatsApp e IA
- **IA**: processa as mensagens recebidas via WhatsApp e gera respostas contextualizadas
- **WhatsApp**: canal principal de interação do produtor com o sistema

## Objetivo

Facilitar a gestão financeira de produtores rurais de pequeno e médio porte, tornando o controle de gastos acessível e prático através de ferramentas que o produtor já usa no dia a dia.
# 22-amigosdavanderleia
