// Rotas do chat
const express = require('express');
const router = express.Router();

module.exports = (chatController) => {
  // Middleware para verificar se o controlador foi injetado
  if (!chatController) {
    throw new Error('ChatController é obrigatório');
  }

  // Rota para obter informações de uma sala específica
  router.get('/rooms/:roomName', (req, res) => {
    chatController.getRoomInfo(req, res);
  });

  // Rota para obter lista de todas as salas
  router.get('/rooms', (req, res) => {
    chatController.getRoomsList(req, res);
  });

  // Rota para obter usuários conectados
  router.get('/users', (req, res) => {
    chatController.getConnectedUsers(req, res);
  });

  // Rota para obter estatísticas do sistema
  router.get('/stats', (req, res) => {
    chatController.getSystemStats(req, res);
  });

  // Rota de health check
  router.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'Chat API está funcionando',
      timestamp: new Date().toISOString()
    });
  });

  return router;
};


