# 💬 Chat RealTime - Comunicação em Tempo Real



## 🎯 **Funcionalidades**

### 💬 **Chat em Tempo Real**
- Comunicação instantânea via Socket.IO
- Indicadores de digitação em tempo real
- Status de conexão dos usuários
- Mensagens do sistema (entrada/saída)

### 📊 **Dashboard Administrativo**
- Métricas em tempo real
- Monitoramento de usuários ativos
- Estatísticas de mensagens
- Interface administrativa completa

### 🔧 **API REST Completa**
- Endpoints para usuários, salas e mensagens
- Documentação Swagger automática
- Health checks e monitoramento
- Rate limiting e segurança

### 🗄️ **Banco de Dados**
- MongoDB para persistência
- Redis para cache e sessões
- Estrutura escalável e performática

---

## 🚀 **Execução Rápida**

```bash
# 1. Navegar para o projeto
cd /home/leandro/gitHub/chat-realTime

# 2. Executar com Podman Compose
podman-compose up -d

# 3. Acessar a aplicação
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# Admin: http://localhost:3001/admin
```

> **Nota**: Para instruções detalhadas, consulte [COMO_EXECUTAR.md](./COMO_EXECUTAR.md)

---

## 🌐 **Acessos**

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:3000 | Interface do usuário |
| **Backend** | http://localhost:3001 | API REST |
| **Admin Dashboard** | http://localhost:3001/admin | Painel administrativo |
| **API Docs** | http://localhost:3001/api-docs | Documentação Swagger |
| **Health Check** | http://localhost:3001/health | Status da aplicação |

---
