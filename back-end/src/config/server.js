// Configuração do servidor
const serverConfig = {
  port: process.env.PORT || 3001,
  host: process.env.HOST || 'localhost',
  env: process.env.NODE_ENV || 'development'
};

module.exports = serverConfig;

