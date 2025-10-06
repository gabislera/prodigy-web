# 🚀 StudyFlow

StudyFlow é uma aplicação web moderna de produtividade desenvolvida com React, TypeScript e Tailwind CSS, que combina funcionalidades de calendário, gerenciamento de tarefas estilo Kanban, sistema de notas com IA e timer Pomodoro. O sistema oferece uma experiência completa de organização pessoal com automações inteligentes e gamificação.

## Funcionalidades

- **Calendário Inteligente**: Visualização em mês, semana e dia com criação rápida de eventos
- **Sistema Kanban**: Gerenciamento de tarefas com drag & drop entre colunas
- **Notas com IA**: Criação automática de notas usando inteligência artificial
- **Timer Pomodoro**: Técnica de produtividade com ciclos de foco e pausa
- **Planejamento Automático**: IA cria eventos, tarefas e notas baseado em datas e prazos
- **Integração Google Calendar**: Sincronização automática de eventos
- **Sistema de Gamificação**: Streaks, conquistas e pontos para manter motivação
- **Interface Responsiva**: Design adaptável para desktop e mobile
- **Autenticação Segura**: Sistema de login com refresh token automático

## Tecnologias utilizadas

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TanStack Query](https://img.shields.io/badge/-TanStack%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)
![TanStack Router](https://img.shields.io/badge/-TanStack%20Router-FF6B6B?style=for-the-badge&logo=react&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix%20UI-161618?style=for-the-badge&logo=radixui&logoColor=white)
![Vercel AI](https://img.shields.io/badge/Vercel%20AI-000000?style=for-the-badge&logo=vercel&logoColor=white)

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/) ou [pnpm](https://pnpm.io/)
- Backend StudyFlow rodando em `http://localhost:3333`

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/studyflow.git
cd studyflow/web
npm install
# ou
yarn install
# ou
pnpm install
```

## Configuração do Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
cp .env.local.example .env.local
```

Configure as variáveis de ambiente:

```env
VITE_API_URL=http://localhost:3333
```

## Execução

Para rodar o projeto em modo de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Acesse [http://localhost:5173](http://localhost:5173) no navegador.

## Funcionalidades do Sistema

### Calendário
- Visualização em múltiplas visualizações (mês, semana, dia)
- Criação rápida de eventos com diálogos intuitivos
- Integração com IA para planejamento automático
- Sincronização com Google Calendar

### Sistema Kanban
- Drag & drop entre colunas
- Reordenação de tarefas
- Grupos de trabalho personalizáveis
- Filtros e busca avançada

### Notas Inteligentes
- Editor Markdown com preview
- Geração automática com IA
- Busca e organização
- Salvamento automático

### Timer Pomodoro
- Ciclos de foco e pausa configuráveis
- Estatísticas de produtividade
- Notificações e alertas
- Histórico de sessões

### Sistema de Gamificação
- Streaks de produtividade
- Conquistas e badges
- Sistema de pontos
- Leaderboards

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza build de produção
- `npm run lint` - Executa verificação de código
- `npm run routes:generate` - Gera rotas do TanStack Router

## Variáveis de Ambiente

- `VITE_API_URL`: URL do servidor da API (obrigatória para comunicação com o backend)

## Roadmap

- [ ] Integração completa com Google Calendar
- [ ] Sistema de conquistas avançado
- [ ] Relatórios de produtividade
- [ ] Modo offline
- [ ] Aplicativo mobile nativo

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

