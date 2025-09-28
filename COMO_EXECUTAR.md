# 🚀 Como Executar - Chat RealTime 

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
yarn install
yarn dev
```

### somente Frontend
```bash
cd front-end
yarn install
yarn start
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

## Testes Front end
"test": "echo '🧪 Executando testes do frontend...' && curl -s http://localhost:3000 | grep -o '<title>.*</title>'",
"test:connectivity": "echo '🧪 Testando conectividade...' && curl -f http://localhost:3000 || echo '❌ Frontend offline'",
"test:full": "echo '🧪 TESTE COMPLETO DO FRONTEND' && yarn test:connectivity && yarn test && echo '✅ Frontend OK'",
"test:performance": "echo '🧪 Teste de performance...' && time curl -s http://localhost:3000 > /dev/null"

## Testes do Back end
"test": "echo '🧪 Executando testes do backend...' && curl -s http://localhost:3001/health | jq .status",
"test:api": "echo '🧪 Testando API endpoints...' && curl -s http://localhost:3001/api/users | jq length",
"test:health": "echo '🧪 Testando health check...' && curl -f http://localhost:3001/health || echo '❌ Health check falhou'",
"test:full": "echo '🧪 TESTE COMPLETO DO BACKEND' && yarn test:health && yarn test:api && echo '✅ Backend OK'",
"test:load": "echo '🧪 Teste de carga...' && for i in {1..10}; do curl -s http://localhost:3001/health > /dev/null & done && wait && echo '✅ Teste de carga concluído'",
"test:security": "echo '🧪 Testando headers de segurança...' && curl -I http://localhost:3001/ | grep -E '(X-Frame-Options|X-Content-Type-Options)' || echo '❌ Headers de segurança não encontrados'"


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
