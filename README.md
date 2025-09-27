# 🚀 Chat em Tempo Real - 2025 Edition

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-20-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)
![Redis](https://img.shields.io/badge/Redis-7.2-red)
![Docker](https://img.shields.io/badge/Docker-✅-blue)
![Tests](https://img.shields.io/badge/Tests-✅-yellow)
![CI/CD](https://img.shields.io/badge/CI/CD-✅-purple)

**Sistema de chat em tempo real desenvolvido com as melhores práticas de desenvolvimento para 2025**

[📖 Documentação da API](./docs/API.md) • [🐳 Docker](./docs/DOCKER.md) • [🧪 Testes](./docs/TESTS.md) • [🔒 Segurança](./docs/SECURITY.md)

</div>

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Arquitetura](#-arquitetura)
- [Stack Tecnológica](#-stack-tecnológica)
- [Funcionalidades](#-funcionalidades)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Execução](#-instalação-e-execução)
- [Desenvolvimento](#-desenvolvimento)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Monitoramento](#-monitoramento)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🎯 Sobre o Projeto

Este projeto representa o desenvolvimento de software moderno para 2025, implementando um sistema de chat em tempo real com:

- ✅ **Clean Architecture/DDD** - Separação clara de responsabilidades
- ✅ **Containerização** - Podman + Podman Compose para desenvolvimento
- ✅ **Testes Automatizados** - Unit, Integration e E2E
- ✅ **CI/CD Pipeline** - GitHub Actions com múltiplos workflows
- ✅ **Documentação API** - Swagger/OpenAPI 3.0 + ReDoc
- ✅ **Monitoramento** - Logging estruturado e health checks
- ✅ **Segurança** - JWT, rate limiting, security scanning
- ✅ **Convenções** - Conventional Commits e branch naming

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**:

```
src/
├── domain/                 # Camada de Domínio
│   ├── entities/          # Entidades de negócio
│   ├── repositories/     # Interfaces dos repositórios
│   └── useCases/         # Casos de uso
├── infrastructure/        # Camada de Infraestrutura
│   ├── database/        # Conexão com MongoDB
│   ├── cache/           # Redis para cache
│   ├── logging/         # Sistema de logs
│   ├── websocket/       # Socket.IO
│   └── repositories/    # Implementações dos repositórios
├── presentation/         # Camada de Apresentação
│   └── routes/          # Controllers e rotas
├── middleware/          # Middlewares customizados
└── app.js              # Configuração da aplicação
```

### Princípios Aplicados

- **Separation of Concerns**: Cada camada tem responsabilidade específica
- **Dependency Inversion**: Dependências apontam para abstrações
- **Single Responsibility**: Cada classe tem uma única responsabilidade
- **Open/Closed Principle**: Aberto para extensão, fechado para modificação

## 🛠️ Stack Tecnológica

### Backend
- **Node.js 20** - Runtime JavaScript LTS
- **Express.js 4.18** - Framework web
- **Socket.IO 4.7** - Comunicação em tempo real
- **MongoDB 7.0** - Banco de dados NoSQL
- **Redis 7.2** - Cache e sessões
- **JWT** - Autenticação stateless
- **Winston** - Sistema de logging
- **Jest** - Framework de testes

### Infraestrutura
- **Podman** - Containerização
- **Podman Compose** - Orquestração de containers
- **Nginx** - Proxy reverso
- **GitHub Actions** - CI/CD

### Qualidade e Segurança
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Husky** - Git hooks
- **Commitlint** - Validação de commits
- **Snyk** - Security scanning
- **SonarCloud** - Análise de qualidade

## ✨ Funcionalidades

### Core Features
- 🏠 **Múltiplas Salas** - Criação e gerenciamento de salas de chat
- 👥 **Gerenciamento de Usuários** - CRUD completo de usuários
- 💬 **Mensagens em Tempo Real** - WebSocket para comunicação instantânea
- ✏️ **Edição de Mensagens** - Editar mensagens enviadas
- 🗑️ **Exclusão de Mensagens** - Deletar mensagens
- 📝 **Histórico** - Buscar mensagens antigas

### Features Avançadas
- 🔐 **Autenticação JWT** - Sistema de autenticação seguro
- ⚡ **Rate Limiting** - Proteção contra spam
- 📊 **Health Checks** - Monitoramento da aplicação
- 📈 **Logging Estruturado** - Logs detalhados para auditoria
- 🔍 **Documentação Interativa** - Swagger UI e ReDoc
- 🧪 **Cobertura de Testes** - Testes unitários, integração e E2E

## 📋 Pré-requisitos

### Desenvolvimento Local
- **Node.js 20+** - [Download](https://nodejs.org/)
- **Yarn 4+** - [Installation Guide](https://yarnpkg.com/getting-started/install)
- **Podman** - [Installation Guide](https://podman.io/getting-started/installation)
- **Git** - [Download](https://git-scm.com/)

### Produção
- **Podman** ou **Docker**
- **MongoDB 7.0+**
- **Redis 7.2+**
- **Nginx** (opcional)

## 🚀 Instalação e Execução

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/chat-realTime.git
cd chat-realTime
```

### 2. Configuração do Ambiente
```bash
# Copiar arquivo de configuração
cp back-end/.env.example back-end/.env

# Editar variáveis de ambiente
nano back-end/.env
```

### 3. Execução com Podman Compose (Recomendado)
```bash
# Iniciar todos os serviços
podman-compose up -d

# Verificar status
podman-compose ps

# Ver logs
podman-compose logs -f
```

### 4. Execução Manual
```bash
# Backend
cd back-end
yarn install
yarn dev

# Frontend (em outro terminal)
cd front-end
yarn install
yarn start
```

### 5. Acessar a Aplicação
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Documentação Swagger**: http://localhost:3001/api-docs
- **Documentação ReDoc**: http://localhost:3001/redoc
- **Health Check**: http://localhost:3001/health

## 💻 Desenvolvimento

### Estrutura de Branches
- `main` - Branch de produção
- `develop` - Branch de desenvolvimento
- `feature/*` - Novas funcionalidades
- `bugfix/*` - Correções de bugs
- `hotfix/*` - Correções urgentes

### Convenção de Commits
Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat(chat): add message editing functionality
fix(auth): resolve JWT token validation
docs(api): update swagger documentation
```

### Scripts Disponíveis
```bash
# Desenvolvimento
yarn dev          # Inicia em modo desenvolvimento
yarn start        # Inicia em modo produção

# Testes
yarn test         # Executa todos os testes
yarn test:unit    # Testes unitários
yarn test:integration # Testes de integração
yarn test:e2e     # Testes end-to-end
yarn test:coverage # Cobertura de testes

# Qualidade
yarn lint         # ESLint
yarn lint:fix     # Corrigir problemas de lint
yarn format       # Prettier
yarn security:audit # Auditoria de segurança

# Dependências
yarn install:clean # Instalação limpa
yarn upgrade      # Atualizar dependências
yarn check        # Verificar integridade
```

## 🧪 Testes

### Estrutura de Testes
```
tests/
├── unit/              # Testes unitários
│   ├── User.test.js
│   ├── Room.test.js
│   └── Message.test.js
├── integration/       # Testes de integração
│   ├── user.test.js
│   ├── room.test.js
│   ├── chat.test.js
│   └── health.test.js
└── e2e/              # Testes end-to-end
    └── chatFlow.test.js
```

### Executar Testes
```bash
# Todos os testes
yarn test

# Testes específicos
yarn test --testPathPattern=unit
yarn test --testPathPattern=integration
yarn test --testPathPattern=e2e

# Com cobertura
yarn test:coverage
```

### Cobertura de Testes
- **Unit Tests**: > 90%
- **Integration Tests**: > 80%
- **E2E Tests**: Cenários críticos

## 🚀 Deploy

### Deploy com Podman Compose
```bash
# Produção
podman-compose -f docker-compose.prod.yml up -d

# Verificar saúde
curl http://localhost/health
```

### Deploy Manual
```bash
# Build das imagens
podman build -t chat-backend ./back-end
podman build -t chat-frontend ./front-end

# Executar containers
podman run -d --name chat-backend -p 3001:3001 chat-backend
podman run -d --name chat-frontend -p 3000:3000 chat-frontend
```

### Variáveis de Ambiente (Produção)
```bash
NODE_ENV=production
MONGODB_URI=mongodb://user:pass@mongodb:27017/chatdb
REDIS_URL=redis://redis:6379
JWT_SECRET=your-super-secret-key
CORS_ORIGIN=https://yourdomain.com
```

## 📊 Monitoramento

### Health Checks
- **Liveness**: `/health/live` - Verifica se a aplicação está rodando
- **Readiness**: `/health/ready` - Verifica se está pronto para receber tráfego
- **Health**: `/health` - Status completo da aplicação

### Logging
- **Estruturado**: Logs em formato JSON
- **Níveis**: error, warn, info, debug
- **Rotação**: Logs são rotacionados automaticamente
- **Auditoria**: Logs de ações importantes

### Métricas
- **Performance**: Tempo de resposta das APIs
- **Uso de Memória**: Monitoramento de recursos
- **Conexões**: Usuários conectados via WebSocket
- **Erros**: Taxa de erro das requisições

## 🤝 Contribuição

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Checklist de Contribuição
- [ ] Código testado
- [ ] Documentação atualizada
- [ ] Testes passando
- [ ] Sem breaking changes
- [ ] Seguindo convenções de commit

### Code Review
- Todos os PRs passam por revisão
- Pelo menos 1 aprovação necessária
- CI/CD deve passar
- Cobertura de testes mantida

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Documentação**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/chat-realTime/issues)
- **Discussions**: [GitHub Discussions](https://github.com/seu-usuario/chat-realTime/discussions)

## 🏆 Reconhecimentos

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

<div align="center">

**Desenvolvido com ❤️ para 2025**

[⬆ Voltar ao topo](#-chat-em-tempo-real---2025-edition)

</div>