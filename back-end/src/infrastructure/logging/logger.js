const winston = require('winston');

// Configuração do logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'chat-backend' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Função para log de auditoria
const logAudit = (action, userId, metadata = {}) => {
  logger.info('AUDIT', {
    action,
    userId,
    metadata,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  logger,
  logAudit
};
