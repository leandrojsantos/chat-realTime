const rateLimit = require('express-rate-limit');
const { logger, logSecurity } = require('../infrastructure/logging/logger');

// Rate limiting para criação de usuários
const createUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas por IP
  message: {
    error: 'Muitas tentativas de criação de usuário. Tente novamente em 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurity('RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      endpoint: '/api/users',
      method: req.method,
    });
    res.status(429).json({
      error: 'Muitas tentativas de criação de usuário. Tente novamente em 15 minutos.',
    });
  },
});

// Rate limiting para envio de mensagens
const sendMessageLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30, // máximo 30 mensagens por minuto
  message: {
    error: 'Muitas mensagens enviadas. Aguarde um momento.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurity('RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      endpoint: '/api/chat/messages',
      method: req.method,
    });
    res.status(429).json({
      error: 'Muitas mensagens enviadas. Aguarde um momento.',
    });
  },
});

// Rate limiting para criação de salas
const createRoomLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // máximo 10 salas por hora
  message: {
    error: 'Muitas salas criadas. Tente novamente em uma hora.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurity('RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      endpoint: '/api/rooms',
      method: req.method,
    });
    res.status(429).json({
      error: 'Muitas salas criadas. Tente novamente em uma hora.',
    });
  },
});

// Rate limiting para login/autenticação
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 tentativas por IP
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurity('RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      endpoint: '/api/auth',
      method: req.method,
    });
    res.status(429).json({
      error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    });
  },
});

module.exports = {
  createUserLimiter,
  sendMessageLimiter,
  createRoomLimiter,
  authLimiter,
};
