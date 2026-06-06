# LINK youtube: https://youtu.be/I8f29gCC0fU

# AgroFinance — Controle Financeiro para Produtores Rurais

Plataforma de gestão financeira voltada para produtores rurais de pequeno e médio porte, combinando uma interface web com interação via WhatsApp e inteligência artificial.

## Visão Geral

O produtor rural interage pelo WhatsApp para consultar e registrar seus gastos financeiros no dia a dia. As informações são visualizadas em dashboards na aplicação web, onde também é feito o login e cadastro.

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                      Usuário                            │
│          (WhatsApp)              (Navegador)            │
└──────────┬───────────────────────────┬──────────────────┘
           │                           │
           ▼                           ▼
┌──────────────────┐        ┌──────────────────────┐
│  WhatsApp API    │        │   Frontend Web        │
│  (Meta / Z-API)  │        │   React + Vite        │
└────────┬─────────┘        │   Recharts / SC       │
         │                  └──────────┬─────────────┘
         ▼                             │
┌──────────────────────────────────────────────────────┐
│                    Backend (API REST)                  │
│          Node.js — JWT Auth — Bearer Token             │
│   /auth  /whatsapp  /gastos  /relatorios  /estoque    │
└────┬─────────────┬──────────────┬──────────┬──────────┘
     │             │              │          │
     ▼             ▼              ▼          ▼
┌─────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐
│   IA    │  │  SEFAZ   │  │   DB     │  │ Clima  │
│(Claude/ │  │ Web Svc  │  │ Postgres │  │  API   │
│ OpenAI) │  │  NF-e    │  │          │  │        │
└─────────┘  └──────────┘  └──────────┘  └────────┘
```

**Stack do Frontend:**

- React 18 + Vite 5
- React Router v6 (SPA com rotas protegidas)
- Styled Components v6
- Recharts (gráficos de área, barra e pizza)
- Lucide React (ícones)

**Variável de ambiente principal:**

| Variável        | Descrição                                            |
| ---------------- | ------------------------------------------------------ |
| `VITE_API_URL` | URL base da API backend (ex:`http://localhost:3000`) |

---

## Como Rodar Localmente

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Passos

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd code-race

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env e defina VITE_API_URL com a URL da sua API

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Build de Produção

```bash
npm run build      # gera a pasta /dist
npm run preview    # serve o build localmente para validação
```

### Testes

```bash
npm test           # roda os testes com Vitest + jsdom
```

---

## Rotas da Aplicação

| Rota               | Descrição                                     |
| ------------------ | ----------------------------------------------- |
| `/`              | Landing page pública                           |
| `/login`         | Login com número de telefone                   |
| `/cadastro`      | Cadastro de novo produtor                       |
| `/whatsapp-otp`  | Verificação OTP via WhatsApp                  |
| `/dashboard`     | Visão geral financeira, gráficos e cotações |
| `/gastos`        | Lançamentos de receitas e despesas             |
| `/relatorios`    | Relatórios por safra e categoria               |
| `/notas-fiscais` | Emissão e consulta de NF-e / NFS-e             |
| `/sefaz`         | NF-e recebidas e status de integração SEFAZ   |
| `/estoque`       | Controle de estoque da propriedade              |
| `/configuracoes` | Dados da fazenda e preferências                |

---

## Features

### Implementadas (Frontend)

- [X] Landing page com apresentação do produto
- [X] Autenticação por número de telefone + OTP WhatsApp
- [X] Rotas protegidas com contexto de autenticação (JWT)
- [X] Sidebar responsiva com navegação completa
- [X] **Dashboard** — cards de resumo financeiro, gráfico de evolução mensal (área), gastos por categoria (pizza), últimos lançamentos e cotações de commodities
- [X] **Gastos** — listagem de receitas e despesas com filtros
- [X] **Relatórios** — visão por safra e categoria
- [X] **Notas Fiscais** — listagem de NF-e e NFS-e com status
- [X] **SEFAZ** — painel de NF-e recebidas e indicador de conexão
- [X] **Estoque** — cadastro e movimentação de insumos
- [X] **Configurações** — dados da fazenda e preferências
- [X] Tema global com design tokens (cores, tipografia, espaçamento)
- [X] Animações de entrada com `IntersectionObserver` (`useInView`)

### Planejadas / Em Desenvolvimento

- [ ] Integração real com backend (API calls substituindo mock data)
- [ ] Emissão de NF-e com transmissão à SEFAZ
- [ ] Monitoramento automático de CNPJ na base SEFAZ
- [ ] Bot WhatsApp com IA para registro de gastos por mensagem
- [ ] Consulta de previsão do tempo e alertas climáticos via WhatsApp
- [ ] Alertas automáticos de estoque mínimo
- [ ] Exportação de relatórios em PDF/Excel
- [ ] App mobile (PWA ou React Native)

---

## Print Screens

> As telas abaixo refletem o estado atual do frontend com dados mockados.

### Landing Page

![Landing Page](docs/screenshots/landing.png)

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)

### Controle de Gastos

![Gastos](docs/screenshots/gastos.png)

### Controle de Estoque

![Estoque](docs/screenshots/estoque.png)

> Para gerar os prints: rode `npm run dev`, navegue pelas rotas e salve os screenshots em `docs/screenshots/`.

---

## Objetivo

Facilitar a gestão financeira de produtores rurais de pequeno e médio porte, tornando o controle de gastos, emissão fiscal e estoque acessíveis e práticos através de ferramentas que o produtor já usa no dia a dia.

---

# 22-amigosdavanderleia
