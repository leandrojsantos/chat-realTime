# 🚀 Como Executar - Chat RealTime Simplificado

## ⚡ **Execução Rápida**

```bash
# 1. Navegar para o projeto
cd /home/leandro/gitHub/chat-realTime

# 2. Executar com Podman Compose
podman-compose up -d

# 3. Acessar
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# Admin: http://localhost:3001/admin
```


## 📋 **Comandos Úteis**

```bash
# Status dos containers
podman-compose ps

# Logs em tempo real
podman-compose logs -f

# Parar serviços
podman-compose down

# Rebuild
podman-compose build
```

## 🌐 **Acessos**

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs
- **Admin Dashboard**: http://localhost:3001/admin
- **Health Check**: http://localhost:3001/health
  
## 🏗️ **Estrutura**

```
chat-realTime/
├── back-end/
│   ├── src/
│   │   ├── app.js         # Aplicação principal
│   │   └── routes/        # Rotas da API
│   └── views/             # Dashboard admin
├── front-end/
│   ├── src/
│   │   ├── App.js         # Aplicação principal
│   │   ├── components/    # Componentes
│   │   └── App.css        # Estilos
└── docker-compose.yml
```


## 🔧 **Desenvolvimento**

### somente Backend
```bash
cd back-end
npm install
npm run dev
```

### somnete Frontend
```bash
cd front-end
npm install
npm start
```

## 🐛 **Problemas Comuns**

### Porta em uso
```bash
sudo fuser -k 3000/tcp
sudo fuser -k 3001/tcp
```

### Containers em uso
```bash
podman-compose down -v
podman system prune -f
podman-compose build --no-cache
```

## 📊 **API Endpoints**

### Health
- `GET /health` - Status da aplicação

### Usuários
- `POST /api/users` - Criar usuário
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário

### Salas
- `POST /api/rooms` - Criar sala
- `GET /api/rooms` - Listar salas
- `GET /api/rooms/:id` - Buscar sala

### Chat
- `POST /api/chat/messages` - Enviar mensagem
- `GET /api/chat/messages/:roomId` - Buscar mensagens
