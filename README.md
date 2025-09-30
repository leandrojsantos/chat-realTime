# 💬 Chat RealTime - Comunicação em Tempo Real

## 🎯 **Funcionalidades**

### 💬 **Chat em Tempo Real**
- ✅ Comunicação instantânea via Socket.IO
- ✅ Indicadores de digitação em tempo real
- ✅ Status de conexão dos usuários
- ✅ Mensagens do sistema (entrada/saída)
- ✅ Múltiplas salas de chat
- ✅ Interface responsiva e moderna

### 📊 **Dashboard Administrativo**
- ✅ Métricas em tempo real
- ✅ Monitoramento de usuários ativos
- ✅ Estatísticas de mensagens
- ✅ Interface administrativa completa
- ✅ Configurações do sistema

### 🔧 **API REST Completa**
- ✅ Endpoints para usuários, salas e mensagens
- ✅ Documentação Swagger automática
- ✅ Health checks e monitoramento
- ✅ Rate limiting e segurança
- ✅ Middleware de autenticação

### 🗄️ **Banco de Dados**
- ✅ MongoDB para persistência
- ✅ Redis para cache e sessões
- ✅ Estrutura escalável e performática
- ✅ Modelos de dados otimizados

### 🧪 **Testes Abrangentes**
- ✅ Testes unitários (Jest)
- ✅ Testes de integração
- ✅ Testes end-to-end (E2E)
- ✅ Cobertura de código
- ✅ Testes de performance

### 🏗️ **Arquitetura**
- ✅ Clean Architecture
- ✅ Padrões de Design (Strategy, Factory)
- ✅ Separação de responsabilidades
- ✅ Código modular e testável

---

## 🚀 **Execução Rápida**

### **Podman Compose (Recomendado)**
```bash
# 1. Navegar para o projeto
cd /home/leandro/gitHub/chat-realTime

# 2. Executar com Docker Compose
docker-compose up -d

# 3. Acessar a aplicação
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# Admin: http://localhost:3001/admin
```

> **Nota**: Para instruções detalhadas, consulte:
  README.md dentro da pasta back-end;
  README.md dentro da pasta front-end;
---

## 🌐 **Acessos quando Chat está em ok**

| Serviço | URL | Descrição | Status |
|---------|-----|-----------|--------|
| **Frontend** | http://localhost:3000 | Interface do usuário | ✅ Ativo |
| **Backend** | http://localhost:3001 | API REST | ✅ Ativo |
| **Admin Dashboard** | http://localhost:3001/admin | Painel administrativo | ✅ Ativo |
| **API Docs** | http://localhost:3001/api-docs | Documentação Swagger | ✅ Ativo |
| **Health Check** | http://localhost:3001/health | Status da aplicação | ✅ Ativo |

---

### **Status dos Testes**
- ✅ **Backend**: 9/9 suítes, 142/142 testes (100%)
- ✅ **Frontend**: 2/2 suítes, 15/15 testes (100%)
- ✅ **E2E**: Aprovados

---

---

## 🔧 **Tecnologias**

### **Backend**
- **Node.js** 20+ - Runtime JavaScript
- **Express.js** - Framework web
- **Socket.IO** - Comunicação em tempo real
- **MongoDB** - Banco de dados
- **Redis** - Cache e sessões
- **Jest** - Framework de testes
- **Supertest** - Testes de API

### **Frontend**
- **React** 18+ - Biblioteca de interface
- **Socket.IO Client** - Cliente WebSocket
- **CSS3** - Estilos modernos
- **Jest** - Framework de testes
- **React Testing Library** - Testes de componentes

### **DevOps**
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Yarn** - Gerenciador de pacotes

---

---

## 👥 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
