# 🎨 Frontend - Chat RealTime Interface

> **Interface React moderna com Socket.IO, design responsivo e padrões de arquitetura**

[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7+-orange.svg)](https://socket.io/)
[![CSS3](https://img.shields.io/badge/CSS3-3.0+-green.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Jest](https://img.shields.io/badge/Jest-29+-purple.svg)](https://jestjs.io/)
[![Testing Library](https://img.shields.io/badge/Testing%20Library-16+-red.svg)](https://testing-library.com/)

## 🎯 **Funcionalidades**

### 💬 **Interface de Chat**
- ✅ Design moderno e responsivo
- ✅ Comunicação em tempo real
- ✅ Status de conexão
- ✅ Mensagens do sistema
- ✅ Múltiplas salas

### 🎨 **Design System**
- ✅ Glassmorphism 2025
- ✅ Gradientes animados
- ✅ Transições suaves
- ✅ Responsive design


### 🏗️ **Arquitetura**
- ✅ Clean Architecture
- ✅ Padrões Strategy e Factory
- ✅ Componentes reutilizáveis
- ✅ Separação de responsabilidades

### 🧪 **Testes**
- ✅ Testes unitários (Jest)
- ✅ Testes de componentes (RTL)
- ✅ Mocks e stubs
- ✅ Cobertura de código

---

## 🚀 **Instalação e Execução**

### **Pré-requisitos**
- Node.js 20+
- Yarn 1.22+
- Backend rodando na porta 3001

### **Instalação**
```bash
# 1. Instalar dependências
yarn install

# 2. Iniciar aplicação
yarn start
```

### **Desenvolvimento**
```bash
# Modo desenvolvimento
yarn start

# Executar testes
yarn test

# Cobertura de testes
yarn test:coverage

# Build para produção
yarn build
```

---

## 📁 **Estrutura do Projeto**

```
front-end/
├── public/
│   ├── index.html           # HTML principal
│   ├── favicon.ico          # Ícone da aplicação
│   └── manifest.json        # PWA manifest
├── src/
│   ├── components/          # Componentes React
│   │   ├── Button.js        # Componente de botão
│   │   ├── Input.js         # Componente de input
│   │   ├── Message.js       # Componente de mensagem
│   │   ├── TypingIndicator.js # Indicador de digitação
│   │   └── chatComponent.js # Componente principal do chat
│   ├── hooks/               # Hooks customizados
│   │   ├── useMessages.js   # Hook para mensagens
│   │   ├── useSocket.js     # Hook para Socket.IO
│   │   └── useTyping.js     # Hook para digitação
│   ├── strategies/          # Padrões de design
│   │   ├── MessageStrategy.js # Estratégia de mensagens
│   │   └── SocketStrategy.js  # Estratégia de Socket
│   ├── __tests__/           # Testes
│   │   ├── App.test.js      # Testes do App
│   │   └── README.md        # Documentação dos testes
│   ├── App.js               # Componente principal
│   ├── App.css              # Estilos principais
│   ├── index.js             # Ponto de entrada
│   └── setupTests.js        # Configuração dos testes
├── package.json             # Dependências e scripts
└── README.md               # Este arquivo
```

---

## 🔧 **Scripts Disponíveis**

| Script | Comando | Descrição |
|--------|---------|-----------|
| **start** | `yarn start` | Inicia aplicação em desenvolvimento |
| **build** | `yarn build` | Build para produção |
| **test** | `yarn test` | Executa testes unitários |
| **eject** | `yarn eject` | Eject do Create React App |

---

## 🎨 **Componentes**

### **App.js**
Componente principal da aplicação que gerencia:
- Estado global da aplicação
- Navegação entre páginas
- Inicialização das estratégias
- Gerenciamento de conexão

### **chatComponent.js**
Componente principal do chat que inclui:
- Interface do chat
- Gerenciamento de mensagens
- Indicadores de digitação
- Eventos de Socket.IO

### **Button.js**
Componente reutilizável de botão com:
- Props customizáveis
- Acessibilidade
- Estilos consistentes

### **Input.js**
Componente de input com:
- Validação
- Placeholder
- Eventos customizados

### **Message.js**
Componente para exibir mensagens com:
- Diferentes tipos de mensagem
- Timestamps
- Metadados do autor

### **TypingIndicator.js**
Indicador de digitação com:
- Animação
- Múltiplos usuários
- Auto-hide

---

## 🎣 **Hooks Customizados**

### **useSocket.js**
```javascript
const socket = useSocket('http://localhost:3001');
```
Gerencia conexão Socket.IO com:
- Conexão automática
- Reconexão
- Event listeners
- Cleanup

### **useMessages.js**
```javascript
const { messages, addMessage } = useMessages(socket);
```
Gerencia estado das mensagens com:
- Lista de mensagens
- Adição de novas mensagens
- Persistência local
- Filtros

### **useTyping.js**
```javascript
const { typingUsers, isTyping, startTyping, stopTyping } = useTyping(socket);
```
Gerencia indicadores de digitação com:
- Lista de usuários digitando
- Controle de estado
- Timeouts automáticos

---

## 🏗️ **Padrões de Design**

### **Strategy Pattern**
```javascript
// MessageStrategy.js
export class MessageStrategy {
  processMessage(message) {
    // Processamento específico
  }
}

// SocketStrategy.js
export class SocketStrategy {
  connect() {
    // Conexão específica
  }
}
```

### **Factory Pattern**
```javascript
// SocketManagerFactory
export class SocketManagerFactory {
  static createForEnvironment(env) {
    switch(env) {
      case 'development':
        return new DevelopmentSocketManager();
      case 'production':
        return new ProductionSocketManager();
    }
  }
}
```

---

## 🎨 **Design System**

### **Cores**
```css
:root {
  /* Primary Colors */
  --primary-500: #0ea5e9;
  --primary-600: #0284c7;
  --primary-700: #0369a1;
  
  /* Gray Scale */
  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-500: #64748b;
  --gray-900: #0f172a;
  
  /* Status Colors */
  --success-500: #10b981;
  --error-500: #ef4444;
  --warning-500: #f59e0b;
}
```

### **Espaçamento**
```css
:root {
  --space-xs: 0.25rem;    /* 4px */
  --space-sm: 0.5rem;     /* 8px */
  --space-md: 1rem;       /* 16px */
  --space-lg: 1.5rem;     /* 24px */
  --space-xl: 2rem;       /* 32px */
  --space-2xl: 3rem;      /* 48px */
}
```

### **Bordas**
```css
:root {
  --radius-sm: 0.375rem;  /* 6px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-2xl: 1.5rem;   /* 24px */
}
```

### **Sombras**
```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
```

---

## 🧪 **Testes**

### **Status dos Testes**
- ✅ **Unitários**: 15/15 testes passando


### **Executar Testes**
```bash
# Todos os testes
yarn test

# Com cobertura
yarn test --coverage

# Modo watch
yarn test --watch

# Verbose
yarn test --verbose
```

### **Estrutura dos Testes**
```
src/__tests__/
├── App.test.js              # Testes do componente App
└── README.md                # Documentação dos testes

src/components/__tests__/
├── chatComponent.test.js    # Testes do componente Chat
└── README.md                # Documentação dos testes
```

### **Exemplo de Teste**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

test('deve renderizar título da aplicação', () => {
  render(<App />);
  const titleElement = screen.getByText(/Chat RealTime/i);
  expect(titleElement).toBeInTheDocument();
});
```

---

## 🎨 **Estilos e CSS**

### **Glassmorphism**
```css
.glass-container {
  background: var(--glass-bg);
  backdrop-filter: blur(24px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-2xl);
  box-shadow: var(--glass-shadow);
}
```

### **Gradientes Animados**
```css
.animated-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### **Transições**
```css
.smooth-transition {
  transition: var(--transition);
}

:root {
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 📱 **Responsive Design**

### **Breakpoints**
```css
/* Mobile First */
@media (max-width: 768px) {
  .chat-window {
    width: 90vw;
    height: 80vh;
    max-width: 400px;
  }
  
  .joinChatContainer {
    min-width: 320px;
    max-width: 90vw;
    padding: var(--space-xl);
  }
}
```

### **Grid System**
```css
.App {
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
}
```

---
>
  🚀 Iniciar Chat
</button>
```

### **Roles**
```jsx
<div 
  className="chat-window" 
  role="application" 
  aria-label="Chat em tempo real"
>
  <header role="banner">
    <h1>💬 Chat RealTime</h1>
  </header>
  
  <main role="main">
    <div 
      className="message-container" 
      role="log" 
      aria-live="polite" 
      aria-label="Mensagens do chat"
    >
      {/* Mensagens */}
    </div>
  </main>
  
  <footer role="contentinfo">
    {/* Input e botão de envio */}
  </footer>
</div>
```

---

## 🔧 **Configuração**

### **Environment Variables**
```bash
# .env
REACT_APP_SOCKET_URL=http://localhost:3001
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development
```

### **Package.json Scripts**
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

---

## 🚀 **Build e Deploy**

### **Build para Produção**
```bash
yarn build
```

### **Docker**
```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### **Docker Compose**
```yaml
version: '3.8'
services:
  frontend:
    build: ./front-end
    ports:
      - "3000:80"
    environment:
      - REACT_APP_SOCKET_URL=http://localhost:3001
      - REACT_APP_API_URL=http://localhost:3001
```

---

## 🐛 **Troubleshooting**

### **Problemas Comuns**

#### **Socket não conecta**
```javascript
// Verificar URL do Socket
const socket = useSocket('http://localhost:3001');

// Verificar se backend está rodando
curl http://localhost:3001/health
```

#### **Testes falhando**
```bash
# Limpar cache
yarn test --clearCache

# Executar com verbose
yarn test --verbose

# Verificar dependências
yarn install
```

#### **Build falhando**
```bash
# Limpar node_modules
rm -rf node_modules
yarn install

# Verificar variáveis de ambiente
echo $REACT_APP_SOCKET_URL
```

---

## 📚 **Documentação Adicional**

- [React Docs](https://reactjs.org/docs/)
- [Socket.IO Client Docs](https://socket.io/docs/v4/client-api/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [ARIA Guidelines](https://www.w3.org/WAI/ARIA/apg/)

---

## 👥 **Contribuição**

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

