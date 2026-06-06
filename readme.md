# LINK youtube: https://youtu.be/I8f29gCC0fU

# Guiar — Controle Financeiro para Produtores Rurais

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
│   /auth  /whatsapp  /financeiro  /estoque  /users     │
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
- Vitest + Testing Library (testes unitários)

**Variável de ambiente principal:**

| Variável | Descrição |
| --- | --- |
| `VITE_API_URL` | URL base da API backend (ex: `http://localhost:3000`) |

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
npm run test:watch # modo watch
```

---

## Rotas da Aplicação

| Rota | Acesso | Descrição |
| --- | --- | --- |
| `/` | Público | Landing page |
| `/login` | Público | Login com e-mail e senha |
| `/cadastro` | Público | Cadastro de novo produtor |
| `/whatsapp/send-otp` | Público | Verificação OTP via WhatsApp |
| `/dashboard` | Privado | Visão geral financeira, gráficos e cotações |
| `/gastos` | Privado | Lançamentos de receitas e despesas |
| `/relatorios` | Privado | Relatórios por safra e categoria |
| `/notas-fiscais` | Privado | Emissão e consulta de NF-e / NFS-e |
| `/sefaz` | Privado | NF-e recebidas e status de integração SEFAZ |
| `/estoque` | Privado | Controle de estoque da propriedade |
| `/configuracoes` | Privado | Dados da conta e preferências |

Rotas privadas são protegidas por `PrivateRoute` — redireciona para `/login` se não houver sessão ativa.

---

## Camada de API (`src/services/api.js`)

Cliente HTTP centralizado com:

- Bearer token via `localStorage` (`guiar_token`)
- Verificação de `res.ok` antes de parsear o corpo — respostas não-JSON (HTML 502/503) não quebram os handlers de erro
- Erros com `.status` e `.errors` para tratamento granular nos componentes

Módulos disponíveis:

| Exportação | Endpoints cobertos |
| --- | --- |
| `api` | Métodos base: `get`, `post`, `put`, `delete` |
| `whatsapp` | `verifyOtp`, `resendOtp` — verificação e reenvio de OTP |
| `financeiro` | `listar`, `criar`, `remover` lançamentos |
| `estoque` | `listar`, `criar`, `resumo`, `alertas`, `movimentacoes`, `buscar`, `atualizar`, `remover`, `movimentar` |

---

## Features

### Integradas com API Real

- [x] Autenticação — login, cadastro e validação de sessão (`/auth/login`, `/auth/register`, `/auth/me`)
- [x] Verificação e reenvio de OTP via WhatsApp (`/whatsapp/verify-otp`, `/whatsapp/resend-otp`)
- [x] **Gastos** — listagem, criação e remoção de lançamentos financeiros com filtros por descrição, categoria e tipo
- [x] **Estoque** — listagem, cadastro, movimentação e resumo de itens; alertas de estoque mínimo
- [x] **Configurações** — edição de perfil (nome, e-mail, WhatsApp, data de nascimento)

### Implementadas (Frontend com dados de demonstração)

- [x] Landing page com apresentação do produto
- [x] Rotas protegidas com contexto de autenticação (JWT)
- [x] Sidebar responsiva com navegação completa
- [x] **Dashboard** — cards de resumo financeiro, gráfico de evolução mensal (área), gastos por categoria (pizza), últimos lançamentos e cotações de commodities
- [x] **Relatórios** — visão por safra e categoria
- [x] **Notas Fiscais** — listagem de NF-e e NFS-e com status
- [x] **SEFAZ** — painel de NF-e recebidas e indicador de conexão
- [x] Tema global com design tokens (cores, tipografia, espaçamento)
- [x] Animações de entrada com `IntersectionObserver` (`useInView`)
- [x] `ErrorBoundary` por rota — erros isolados não derrubam toda a aplicação

### Planejadas / Em Desenvolvimento

- [ ] Integração real com backend para Dashboard, Relatórios, Notas Fiscais e SEFAZ
- [ ] Emissão de NF-e com transmissão à SEFAZ
- [ ] Monitoramento automático de CNPJ na base SEFAZ
- [ ] Bot WhatsApp com IA para registro de gastos por mensagem
- [ ] Consulta de previsão do tempo e alertas climáticos via WhatsApp
- [ ] Alertas automáticos de estoque mínimo via WhatsApp
- [ ] Exportação de relatórios em PDF/Excel
- [ ] App mobile (PWA ou React Native)

---

## Testes

Suite com Vitest + Testing Library cobrindo:

- `AuthContext` — carregamento de sessão, login, logout e erro de token inválido
- `PrivateRoute` — redirecionamento quando não autenticado
- `Login` — submissão de formulário e tratamento de erro 401
- `mockData` — integridade dos dados de demonstração
- `api` — contrato do cliente HTTP

```bash
npm test
```

---

## Print Screens

> As telas abaixo refletem o estado atual do frontend.

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
