# 🧪 Testes - Chat RealTime Backend

> **Suite abrangente de testes para a API Node.js com Jest, Supertest e Socket.IO**

[![Jest](https://img.shields.io/badge/Jest-29+-purple.svg)](https://jestjs.io/)
[![Supertest](https://img.shields.io/badge/Supertest-6.3+-green.svg)](https://github.com/visionmedia/supertest)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7+-orange.svg)](https://socket.io/)
[![Coverage](https://img.shields.io/badge/Coverage-75%25-yellow.svg)](https://jestjs.io/docs/en/cli#--coverage)

## 🎯 **Estrutura de Testes**

### 📁 **Organização**
```
tests/
├── unit/                    # Testes unitários
│   ├── app.test.js         # Testes da classe App
│   ├── userRoutes.test.js  # Testes das rotas de usuário
│   ├── Message.test.js     # Testes da entidade Message
│   ├── Room.test.js        # Testes da entidade Room
│   ├── User.test.js        # Testes da entidade User
│   └── chatController.test.js # Testes do controlador de chat
├── integration/             # Testes de integração
│   └── api.test.js         # Testes da API completa
├── e2e/                     # Testes end-to-end
│   ├── chatFlow.test.js    # Fluxo completo de chat
│   ├── adminDashboard.test.js # Dashboard administrativo
│   └── setup.js            # Configuração E2E
├── setup.js                 # Configuração global
└── README.md               # Este arquivo
```

---

## 🚀 **Execução dos Testes**

### **Comandos Disponíveis**
```bash
# Todos os testes
yarn test

# Apenas unitários
yarn test tests/unit

# Apenas integração
yarn test tests/integration

# Apenas E2E
yarn test:e2e

# Com cobertura
yarn test:coverage

# Modo watch
yarn test:watch

# Verbose
yarn test --verbose
```

### **Configuração Jest**
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
```

---

## 🧪 **Tipos de Testes**

### **1. Testes Unitários**
Testam componentes isolados sem dependências externas.

#### **app.test.js**
```javascript
describe('Classe App', () => {
  test('deve criar uma instância da aplicação', () => {
    const app = new App();
    expect(app.app).toBeDefined();
    expect(app.server).toBeDefined();
    expect(app.port).toBe(3001);
  });
});
```

#### **userRoutes.test.js**
```javascript
describe('Rotas de Usuário', () => {
  test('deve retornar lista de usuários', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

### **2. Testes de Integração**
Testam a interação entre componentes e a API completa.

#### **api.test.js**
```javascript
describe('Integração da API', () => {
  test('deve responder health check', async () => {
    const response = await request(app.app)
      .get('/health')
      .expect(200);
    
    expect(response.body.status).toBe('healthy');
  });
});
```

### **3. Testes End-to-End (E2E)**
Testam o fluxo completo da aplicação incluindo Socket.IO.

#### **chatFlow.test.js**
```javascript
describe('Chat Flow E2E Tests', () => {
  test('should send and receive messages', (done) => {
    const messageData = {
      room: 'test-room',
      author: 'test-user',
      message: 'Hello World!',
      time: new Date().toLocaleTimeString()
    };

    clientSocket.on('connect', () => {
      clientSocket.emit('send_message', messageData);
    });

    clientSocket.on('receive_message', (data) => {
      expect(data.message).toBe(messageData.message);
      done();
    });
  });
});
```

---

## 📊 **Status dos Testes**

### **Resumo Atual**
| Tipo | Suites | Testes | Status |
|------|--------|--------|--------|
| **Unitários** | 2/6 | 23/30 | ⚠️ Parcial |
| **Integração** | 1/1 | 5/5 | ✅ Passando |
| **E2E** | 0/2 | 0/25 | ❌ Falhando |
| **Total** | 3/9 | 28/60 | ⚠️ 47% |

### **Detalhamento**

#### **✅ Testes Passando**
- **userRoutes.test.js**: 5/5 testes
- **api.test.js**: 5/5 testes
- **app.test.js**: 3/4 testes (1 falhando)

#### **⚠️ Testes Parciais**
- **app.test.js**: Porta incorreta (esperado 3001, recebido 3002)
- **adminDashboard.test.js**: App não inicializada corretamente
- **chatFlow.test.js**: Socket não conecta

#### **❌ Testes Falhando**
- **Message.test.js**: Módulo não encontrado
- **Room.test.js**: Módulo não encontrado
- **User.test.js**: Módulo não encontrado
- **chatController.test.js**: Módulo não encontrado

---

## 🔧 **Configuração e Setup**

### **setup.js (Global)**
```javascript
// Configuração global dos testes
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
});

afterAll(async () => {
  if (mongoServer) {
    await mongoServer.stop();
  }
});
```

### **setup.js (E2E)**
```javascript
// Configuração específica para E2E
const App = require('../../src/app');

let app;
let server;

beforeAll(async () => {
  app = new App();
  server = app.server;
  await new Promise(resolve => setTimeout(resolve, 1000));
});

afterAll(async () => {
  if (server) {
    server.close();
  }
});
```

---

## 🎯 **Cobertura de Código**

### **Comando**
```bash
yarn test:coverage
```

### **Relatório**
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info`
- **Texto**: Console output

### **Métricas Atuais**
- **Statements**: 75%
- **Branches**: 70%
- **Functions**: 80%
- **Lines**: 75%

---

## 🐛 **Problemas Conhecidos**

### **1. Módulos Não Encontrados**
```
Cannot find module '../../src/domain/entities/Message'
Cannot find module '../../src/application/services/chatService'
```

**Solução**: Criar os módulos faltantes ou ajustar os imports nos testes.

### **2. Socket.IO E2E**
```
xhr poll error
Exceeded timeout of 5000 ms
```

**Solução**: Garantir que o servidor esteja rodando antes dos testes E2E.

### **3. Porta Incorreta**
```
Expected: 3001
Received: "3002"
```

**Solução**: Ajustar configuração de porta nos testes.

---

## 🚀 **Melhorias Planejadas**

### **Curto Prazo**
- [ ] Criar módulos faltantes (Message, Room, User)
- [ ] Corrigir configuração de porta
- [ ] Implementar setup adequado para E2E
- [ ] Adicionar mocks para dependências externas

### **Médio Prazo**
- [ ] Aumentar cobertura para 90%+
- [ ] Implementar testes de performance
- [ ] Adicionar testes de segurança
- [ ] Criar testes de carga

### **Longo Prazo**
- [ ] Implementar CI/CD com testes
- [ ] Adicionar testes de acessibilidade
- [ ] Criar testes de regressão
- [ ] Implementar testes de contrato

---

## 📝 **Exemplos de Testes**

### **Teste de API**
```javascript
describe('API Endpoints', () => {
  test('GET /health should return status', async () => {
    const response = await request(app.app)
      .get('/health')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });
});
```

### **Teste de Socket.IO**
```javascript
describe('Socket Events', () => {
  test('should handle message broadcasting', (done) => {
    const messageData = {
      room: 'test',
      author: 'user1',
      message: 'Hello!'
    };

    clientSocket1.on('connect', () => {
      clientSocket1.emit('send_message', messageData);
    });

    clientSocket2.on('receive_message', (data) => {
      expect(data.message).toBe(messageData.message);
      done();
    });
  });
});
```

### **Teste de Integração**
```javascript
describe('User Flow', () => {
  test('should complete user registration and chat', async () => {
    // 1. Criar usuário
    const userResponse = await request(app.app)
      .post('/api/users')
      .send({ name: 'Test User', email: 'test@example.com' })
      .expect(201);

    // 2. Verificar criação
    expect(userResponse.body.message).toBe('Usuário criado com sucesso');

    // 3. Enviar mensagem
    const messageResponse = await request(app.app)
      .post('/api/chat/messages')
      .send({ message: 'Hello!', author: 'Test User', room: 'general' })
      .expect(201);

    expect(messageResponse.body.message).toBe('Mensagem enviada com sucesso');
  });
});
```

---

## 🔧 **Ferramentas e Bibliotecas**

### **Jest**
- Framework de testes principal
- Mocks e stubs integrados
- Cobertura de código
- Snapshots

### **Supertest**
- Testes de API HTTP
- Integração com Express
- Assertions de resposta

### **Socket.IO Client**
- Testes de WebSocket
- Cliente para E2E
- Event listeners

### **MongoDB Memory Server**
- Banco de dados em memória
- Isolamento de testes
- Setup/teardown automático

---

## 📚 **Documentação Adicional**

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Guide](https://github.com/visionmedia/supertest)
- [Socket.IO Testing](https://socket.io/docs/v4/testing/)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)

---

## 👥 **Contribuição**

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingTest`)
3. Escreva testes para sua feature
4. Execute `yarn test` para verificar
5. Commit suas mudanças (`git commit -m 'Add AmazingTest'`)
6. Push para a branch (`git push origin feature/AmazingTest`)
7. Abra um Pull Request

---

## 📝 **Licença**

MIT License - veja o arquivo [LICENSE](../../LICENSE) para detalhes.

---

**Desenvolvido com ❤️ usando Jest e ferramentas de teste modernas**