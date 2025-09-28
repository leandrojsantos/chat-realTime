# Chat RealTime - Clean Architecture

[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-7.2-red)](https://redis.io/)
[![Podman](https://img.shields.io/badge/Podman-✅-blue)](https://podman.io/)

Sistema de chat em tempo real implementado com **Clean Architecture** e **Domain-Driven Design**.

## 🏗️ Arquitetura

```
back-end/src/
├── domain/                 # Camada de Domínio
│   ├── entities/          # Entidades de negócio
│   ├── repositories/      # Interfaces dos repositórios
│   └── useCases/          # Casos de uso
├── infrastructure/        # Camada de Infraestrutura
│   ├── database/         # Conexão MongoDB
│   ├── cache/            # Redis
│   ├── logging/          # Winston
│   ├── websocket/        # Socket.IO
│   └── repositories/     # Implementações
├── presentation/          # Camada de Apresentação
│   └── routes/           # Controllers
├── middleware/           # Middlewares
└── app.js               # Configuração
```

## 🛠️ Stack

### Backend
- **Node.js 20** + **Express.js**
- **Socket.IO** para tempo real
- **MongoDB** + **Redis**
- **Winston** para logs
- **Swagger** para documentação

### Frontend
- **React 18** + **Socket.IO Client**
- **React Scripts** para build

### Infraestrutura
- **Podman** + **Podman Compose**
- **Multi-stage Dockerfiles**

## 🚀 Quick Start

### 1. Clone e Execute
```bash
git clone <repo>
cd chat-realTime
podman-compose up -d
```

### 2. Acesse
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs

## 📋 Comandos

```bash
# Desenvolvimento
podman-compose up -d          # Iniciar
podman-compose down           # Parar
podman-compose logs -f        # Logs
podman-compose ps             # Status

# Build
podman-compose build          # Rebuild
```

## 🔧 Configuração

### Variáveis de Ambiente
```bash
# back-end/.env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://admin:password123@mongodb:27017/chatdb?authSource=admin
REDIS_URL=redis://redis:6379
CORS_ORIGIN=http://localhost:3000
```

## 📊 Endpoints

### Health Checks
- `GET /health` - Status geral
- `GET /health/ready` - Readiness
- `GET /health/live` - Liveness

### API
- `POST /api/users` - Criar usuário
- `GET /api/users/:id` - Buscar usuário
- `POST /api/rooms` - Criar sala
- `GET /api/rooms` - Listar salas
- `POST /api/chat/messages` - Enviar mensagem

## 🧪 Testes

```bash
# Backend
cd back-end
yarn test

# Frontend
cd front-end
yarn test
```

## 📦 Estrutura do Projeto

```
chat-realTime/
├── back-end/              # API Node.js
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── front-end/             # React App
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml     # Orquestração
└── README.md
```

## 🔍 Monitoramento

### Logs Estruturados
```json
{
  "level": "info",
  "message": "Usuário conectado",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "service": "chat-backend"
}
```

### Health Checks
```bash
curl http://localhost:3001/health
```

## 🚀 Deploy

### Produção
```bash
# Build e deploy
podman-compose -f docker-compose.prod.yml up -d

# Verificar
curl http://localhost/health
```

## 📝 Desenvolvimento

### Convenções
- **Commits**: Conventional Commits
- **Branches**: `feature/*`, `bugfix/*`, `hotfix/*`
- **Code Review**: Obrigatório

### Scripts
```bash
# Backend
yarn start                 # Produção
yarn dev                   # Desenvolvimento

# Frontend
yarn start                 # Desenvolvimento
yarn build                 # Build produção
```

## 🔒 Segurança

- **Rate Limiting**: 100 req/15min
- **CORS**: Configurado
- **Helmet**: Headers de segurança
- **Input Validation**: Joi

**Desenvolvido com Clean Architecture e DDD**