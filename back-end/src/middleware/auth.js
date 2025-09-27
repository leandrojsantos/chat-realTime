const jwt = require('jsonwebtoken');
const { logger, logSecurity } = require('../infrastructure/logging/logger');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logSecurity('UNAUTHORIZED_ACCESS', { 
      ip: req.ip, 
      url: req.url, 
      method: req.method 
    });
    return res.status(401).json({ error: 'Token de acesso necessário' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      logSecurity('INVALID_TOKEN', { 
        ip: req.ip, 
        url: req.url, 
        method: req.method,
        error: err.message 
      });
      return res.status(403).json({ error: 'Token inválido' });
    }

    req.user = user;
    next();
  });
};

const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

const validateUserData = (req, res, next) => {
  const { name, email, dateOfBirth } = req.body;

  if (!name || !email || !dateOfBirth) {
    return res.status(400).json({ 
      error: 'Nome, email e data de nascimento são obrigatórios' 
    });
  }

  // Validar formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Formato de email inválido' 
    });
  }

  // Validar data de nascimento
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  if (birthDate >= today) {
    return res.status(400).json({ 
      error: 'Data de nascimento deve ser anterior à data atual' 
    });
  }

  next();
};

const validateRoomData = (req, res, next) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ 
      error: 'Nome e descrição são obrigatórios' 
    });
  }

  if (name.length < 2 || name.length > 50) {
    return res.status(400).json({ 
      error: 'Nome da sala deve ter entre 2 e 50 caracteres' 
    });
  }

  if (description.length < 5 || description.length > 200) {
    return res.status(400).json({ 
      error: 'Descrição deve ter entre 5 e 200 caracteres' 
    });
  }

  next();
};

const validateMessageData = (req, res, next) => {
  const { content, userId, roomId } = req.body;

  if (!content || !userId || !roomId) {
    return res.status(400).json({ 
      error: 'Conteúdo, userId e roomId são obrigatórios' 
    });
  }

  if (content.length < 1 || content.length > 2000) {
    return res.status(400).json({ 
      error: 'Conteúdo da mensagem deve ter entre 1 e 2000 caracteres' 
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  generateToken,
  validateUserData,
  validateRoomData,
  validateMessageData,
};
