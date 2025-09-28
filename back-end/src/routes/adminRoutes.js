const express = require('express');
const router = express.Router();
const path = require('path');

// Serve admin dashboard
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin.html'));
});

// API endpoints for admin dashboard
router.get('/api/stats', (req, res) => {
  // Mock statistics data
  const stats = {
    onlineUsers: Math.floor(Math.random() * 50) + 10,
    activeRooms: Math.floor(Math.random() * 20) + 5,
    messagesToday: Math.floor(Math.random() * 1000) + 500,
    systemStatus: 'online',
    peakUsers: Math.floor(Math.random() * 100) + 50,
    messagesPerHour: Math.floor(Math.random() * 100) + 20,
    responseTime: Math.floor(Math.random() * 50) + 10,
    uptime: '99.9%'
  };
  
  res.json(stats);
});

router.get('/api/users', (req, res) => {
  // Mock users data
  const users = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      lastActivity: new Date().toISOString(),
      status: 'online'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@example.com',
      lastActivity: new Date(Date.now() - 300000).toISOString(),
      status: 'online'
    },
    {
      id: 3,
      name: 'Pedro Costa',
      email: 'pedro@example.com',
      lastActivity: new Date(Date.now() - 600000).toISOString(),
      status: 'offline'
    }
  ];
  
  res.json(users);
});

router.get('/api/rooms', (req, res) => {
  // Mock rooms data
  const rooms = [
    {
      id: 1,
      name: 'Geral',
      users: Math.floor(Math.random() * 20) + 5,
      messages: Math.floor(Math.random() * 500) + 100,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'active'
    },
    {
      id: 2,
      name: 'Desenvolvimento',
      users: Math.floor(Math.random() * 15) + 3,
      messages: Math.floor(Math.random() * 300) + 50,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      status: 'active'
    },
    {
      id: 3,
      name: 'Suporte',
      users: Math.floor(Math.random() * 10) + 2,
      messages: Math.floor(Math.random() * 200) + 30,
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      status: 'active'
    }
  ];
  
  res.json(rooms);
});

router.get('/api/messages', (req, res) => {
  // Mock messages data
  const messages = [
    {
      id: 1,
      user: 'João Silva',
      room: 'Geral',
      message: 'Olá pessoal!',
      timestamp: new Date().toISOString(),
      type: 'text'
    },
    {
      id: 2,
      user: 'Maria Santos',
      room: 'Desenvolvimento',
      message: 'Alguém pode me ajudar com React?',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      type: 'text'
    },
    {
      id: 3,
      user: 'Pedro Costa',
      room: 'Suporte',
      message: 'Problema resolvido!',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      type: 'text'
    }
  ];
  
  res.json(messages);
});

router.get('/api/activity', (req, res) => {
  // Mock activity data
  const activity = [
    {
      id: 1,
      user: 'João Silva',
      action: 'Entrou na sala',
      room: 'Geral',
      timestamp: new Date().toISOString(),
      status: 'online'
    },
    {
      id: 2,
      user: 'Maria Santos',
      action: 'Enviou mensagem',
      room: 'Desenvolvimento',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      status: 'online'
    },
    {
      id: 3,
      user: 'Pedro Costa',
      action: 'Saiu da sala',
      room: 'Suporte',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      status: 'offline'
    }
  ];
  
  res.json(activity);
});

// Settings endpoints
router.get('/api/settings', (req, res) => {
  const settings = {
    maxMessages: 1000,
    inactivityTimeout: 30,
    maintenanceMode: false
  };
  
  res.json(settings);
});

router.post('/api/settings', (req, res) => {
  // In a real application, you would save these settings to a database
  console.log('Settings updated:', req.body);
  res.json({ success: true, message: 'Configurações salvas com sucesso!' });
});

// Health check endpoint
router.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

module.exports = router;
