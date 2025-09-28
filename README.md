# 💬 Chat RealTime - Simples e Eficiente


## 🎯 **Funcionalidades**

- ✅ Chat em tempo real com Socket.IO
- ✅ Interface moderna e responsiva
- ✅ Dashboard administrativo
- ✅ API REST completa
- ✅ MongoDB + Redis
- ✅ Design 2025 com glassmorphism

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


## 🌐 **Acessos**

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs
- **Admin Dashboard**: http://localhost:3001/admin
- **Health Check**: http://localhost:3001/health

## 🏗️ **Estrutura**

```
chat-realTime/
├── back-end/              # API Node.js
│   ├── src/
│   │   ├── app.js         # Aplicação principal
│   │   └── routes/        # Rotas da API
│   ├── views/             # Dashboard admin
│   └── package.json
├── front-end/             # React App
│   ├── src/
│   │   ├── App.js         # Aplicação principal
│   │   ├── components/    # Componentes
│   │   └── App.css        # Estilos
│   └── package.json
├── docker-compose.yml     # Orquestração
└── README.md
```

## 🛠️ **Stacks**

### Backend
- **Node.js** + **Express.js**
- **Socket.IO** para tempo real
- **MongoDB** + **Redis**
- **Swagger** para documentação

### Frontend
- **React 18** + **Socket.IO Client**
- **CSS moderno** com glassmorphism
- **Design responsivo**

### Infraestrutura
- **Podman** + **Podman Compose**
- **Multi-stage Dockerfiles**

## 🎨 **Design 2025**

- **Glassmorphism** com blur e transparência
- **Gradientes** modernos
- **Animações** suaves
- **Tipografia** Inter
- **Cores** vibrantes e acessíveis
