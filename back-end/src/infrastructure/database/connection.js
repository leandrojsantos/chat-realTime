const mongoose = require('mongoose');
const { logger } = require('../logging/logger');

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatdb';
      
      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
      };

      await mongoose.connect(mongoUri, options);
      
      this.isConnected = true;
      logger.info('Conectado ao MongoDB com sucesso');

      // Event listeners
      mongoose.connection.on('error', (error) => {
        logger.error('Erro na conexão MongoDB:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('Desconectado do MongoDB');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('Reconectado ao MongoDB');
        this.isConnected = true;
      });

    } catch (error) {
      logger.error('Erro ao conectar com MongoDB:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('Desconectado do MongoDB');
    } catch (error) {
      logger.error('Erro ao desconectar do MongoDB:', error);
      throw error;
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
    };
  }
}

const databaseConnection = new DatabaseConnection();

module.exports = {
  connectDatabase: () => databaseConnection.connect(),
  disconnectDatabase: () => databaseConnection.disconnect(),
  getDatabaseStatus: () => databaseConnection.getConnectionStatus(),
};