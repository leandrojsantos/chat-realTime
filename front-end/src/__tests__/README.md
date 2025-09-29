# Testes do Frontend

Este diretório contém todos os testes para o frontend da aplicação de chat em tempo real.

## Estrutura de Testes

```
src/
├── __tests__/           # Testes do componente principal
│   ├── App.test.js      # Testes do componente App
│   └── README.md        # Este arquivo
└── components/
    └── __tests__/       # Testes dos componentes
        ├── chatComponent.test.js  # Testes do componente Chat
        └── README.md              # Documentação dos testes
```

## Tipos de Testes

### Testes do Componente App (`__tests__/`)
Testam o componente principal da aplicação:

- **App.test.js**: Testa a renderização e interações do App
  - Renderização inicial da página
  - Exibição de funcionalidades
  - Estrutura semântica
  - Interações do usuário (prompt de nome)
  - Navegação entre páginas
  - Acessibilidade

### Testes dos Componentes (`components/__tests__/`)
Testam componentes específicos:

- **chatComponent.test.js**: Testa o componente de chat
  - Renderização do chat
  - Funcionalidade de mensagens
  - Funcionalidade de digitação
  - Recebimento de mensagens
  - Navegação
  - Acessibilidade

## Como Executar os Testes

### Instalar dependências de teste
```bash
cd front-end
yarn add --dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

### Executar todos os testes
```bash
yarn test
```

### Executar testes específicos
```bash
# Testes do App
yarn test src/__tests__/App.test.js

# Testes dos componentes
yarn test src/components/__tests__/chatComponent.test.js

# Testes com watch mode
yarn test --watch
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
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/src/setupTests.js"],
    "collectCoverageFrom": [
      "src/**/*.{js,jsx}",
      "!src/**/*.test.{js,jsx}",
      "!src/index.js",
      "!src/reportWebVitals.js"
    ],
    "coverageDirectory": "coverage",
    "coverageReporters": ["text", "lcov", "html"]
  }
}
```

## Descrições dos Testes

### Testes do Componente App
- **Renderização Inicial**: Verifica se a página inicial é exibida corretamente
- **Funcionalidades**: Testa exibição das funcionalidades da aplicação
- **Estrutura Semântica**: Verifica roles ARIA e estrutura HTML
- **Interações**: Testa prompt de nome de usuário
- **Navegação**: Testa transição entre páginas
- **Acessibilidade**: Verifica labels e estrutura para leitores de tela

### Testes do Componente Chat
- **Renderização**: Verifica se o chat é exibido corretamente
- **Mensagens**: Testa envio e recebimento de mensagens
- **Digitação**: Testa indicadores de digitação
- **Socket.IO**: Testa integração com WebSocket
- **Navegação**: Testa botão de voltar
- **Acessibilidade**: Verifica labels e limites de caracteres

## Mock e Simulações

Os testes utilizam:
- **@testing-library/react**: Para renderização e interações
- **@testing-library/jest-dom**: Para matchers customizados
- **Jest**: Para framework de testes
- **Mocks**: Para simular Socket.IO e prompts do navegador

### Mocks Utilizados

#### Socket.IO Client
```javascript
const mockEmit = jest.fn();
const mockOn = jest.fn();
const mockClose = jest.fn();

jest.mock('socket.io-client', () => {
  return jest.fn(() => ({
    emit: mockEmit,
    on: mockOn,
    close: mockClose,
  }));
});
```

#### Componente Chat
```javascript
jest.mock('../components/chatComponent', () => {
  return function MockChat({ onBackToHome }) {
    return (
      <div data-testid="chat-component">
        <h1>Chat Component</h1>
        <button onClick={onBackToHome} data-testid="back-button">
          Voltar
        </button>
      </div>
    );
  };
});
```

#### Window Prompt
```javascript
const mockPrompt = jest.spyOn(window, 'prompt');
mockPrompt.mockReturnValue('Nome do Usuário');
```

## Cobertura de Testes

**Status Atual: 15/15 testes passando (100%)**

Os testes cobrem:
- ✅ Renderização de componentes
- ✅ Interações do usuário
- ✅ Navegação entre páginas
- ✅ Funcionalidade de chat
- ✅ Integração com Socket.IO
- ✅ Acessibilidade
- ✅ Tratamento de erros
- ✅ Estrutura semântica HTML5
- ✅ Labels ARIA apropriados

## Casos de Teste

### Componente App
1. **Renderização Inicial**
   - Exibe título e subtítulo
   - Mostra funcionalidades
   - Exibe links rápidos
   - Mostra status dos serviços

2. **Interações do Usuário**
   - Prompt para nome de usuário
   - Transição para chat
   - Cancelamento do prompt
   - Nome vazio

3. **Navegação**
   - Voltar para página inicial
   - Manutenção do estado

### Componente Chat
1. **Funcionalidade de Mensagens**
   - Envio via botão
   - Envio via Enter
   - Validação de mensagem vazia
   - Limpeza do campo

2. **Funcionalidade de Digitação**
   - Emissão de evento de digitação
   - Parada automática após 1 segundo
   - Indicadores visuais

3. **Recebimento de Mensagens**
   - Exibição de mensagens recebidas
   - Indicadores de digitação
   - Diferentes tipos de mensagem

## Manutenção dos Testes

- Atualize os testes quando modificar componentes
- Mantenha os mocks atualizados
- Execute os testes antes de cada commit
- Monitore a cobertura de código
- Teste novos casos de uso
