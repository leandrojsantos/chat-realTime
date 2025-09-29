# Testes do Backend

Este diretório contém todos os testes para o backend da aplicação de chat em tempo real.

## Estrutura de Testes

```
tests/
├── unit/           # Testes unitários
│   ├── app.test.js         # Testes da classe App
│   └── userRoutes.test.js  # Testes das rotas de usuários
├── integration/    # Testes de integração
│   └── api.test.js         # Testes da API completa
├── e2e/           # Testes end-to-end
│   └── chatFlow.test.js    # Testes do fluxo completo de chat
└── README.md      # Este arquivo
```

## Tipos de Testes

### Testes Unitários (`unit/`)
Testam componentes individuais isoladamente:

- **app.test.js**: Testa a inicialização e configuração da classe App
  - Inicialização da aplicação
  - Configuração de middlewares de segurança
  - Configuração de CORS
  - Rotas da aplicação
  - Configuração do Swagger
  - Rate limiting

- **userRoutes.test.js**: Testa as rotas de usuários
  - Criação de usuários
  - Listagem de usuários
  - Busca de usuário por ID
  - Parâmetros de paginação

### Testes de Integração (`integration/`)
Testam a interação entre diferentes componentes:

- **api.test.js**: Testa o fluxo completo da API
  - Fluxo completo de usuários
  - Fluxo completo de salas
  - Fluxo completo de chat
  - Health check e status
  - Middleware de segurança

### Testes End-to-End (`e2e/`)
Testam o fluxo completo da aplicação:

- **chatFlow.test.js**: Testa cenários completos de chat
  - Usuário novo no chat
  - Múltiplos usuários simultâneos
  - Diferentes salas de chat
  - Erros e casos extremos

## Como Executar os Testes

### Instalar dependências de teste
```bash
cd back-end
yarn add --dev jest supertest
```

### Executar todos os testes
```bash
yarn test
```

### Executar testes específicos
```bash
# Testes unitários
yarn test tests/unit/

# Testes de integração
yarn test tests/integration/

# Testes end-to-end
yarn test tests/e2e/

# Teste específico
yarn test tests/unit/app.test.js
```

### Executar com cobertura
```bash
yarn test --coverage
```

## Configuração do Jest

Adicione ao `package.json`:

```json
{
  "jest": {
    "testEnvironment": "node",
    "testMatch": ["**/tests/**/*.test.js"],
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/**/*.test.js"
    ],
    "coverageDirectory": "coverage",
    "coverageReporters": ["text", "lcov", "html"]
  }
}
```

## Descrições dos Testes

### Testes da Classe App
- **Inicialização**: Verifica se a aplicação é criada corretamente
- **Segurança**: Testa headers de segurança (X-Frame-Options, X-Content-Type-Options)
- **CORS**: Verifica configuração de CORS
- **Rotas**: Testa endpoints principais (/health, /, /docs)
- **Swagger**: Verifica configuração da documentação
- **Rate Limiting**: Testa limitação de requisições

### Testes das Rotas de Usuários
- **Criação**: Testa POST /api/users com dados válidos
- **Listagem**: Testa GET /api/users com paginação
- **Busca**: Testa GET /api/users/:id
- **Validação**: Testa tratamento de dados inválidos

### Testes de Integração da API
- **Fluxo Completo**: Testa criação → listagem → busca de usuários
- **Múltiplas Rotas**: Testa integração entre diferentes endpoints
- **Middleware**: Verifica aplicação de middlewares de segurança
- **Status**: Testa health check e informações da API

### Testes End-to-End de Chat
- **Cenário Principal**: Usuário novo entra no chat
- **Múltiplos Usuários**: Vários usuários simultâneos
- **Múltiplas Salas**: Diferentes salas de chat
- **Casos Extremos**: Dados inválidos e erros

## Mock e Simulações

Os testes utilizam:
- **Supertest**: Para testes de API HTTP
- **Jest**: Para framework de testes
- **Mocks**: Para simular dependências externas

## Cobertura de Testes

**Status Atual: 26/26 testes passando (100%)**

Os testes cobrem:
- ✅ Inicialização da aplicação
- ✅ Rotas da API
- ✅ Middlewares de segurança
- ✅ Headers de segurança (X-Content-Type-Options, X-Frame-Options)
- ✅ Configuração do Socket.IO
- ✅ Health check com uptime e memory
- ✅ Swagger documentation
- ✅ Tratamento de erros
- ✅ Fluxos completos de chat
- ✅ CORS configuration

## Manutenção dos Testes

- Atualize os testes quando adicionar novas funcionalidades
- Mantenha os mocks atualizados
- Execute os testes antes de cada commit
- Monitore a cobertura de código
