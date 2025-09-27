const redis = require('redis');
const { logger } = require('./logging/logger');

class RedisConnection {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      this.client = redis.createClient({
        url: redisUrl,
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            logger.error('Redis server connection refused');
            return new Error('Redis server connection refused');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            logger.error('Redis retry time exhausted');
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 10) {
            logger.error('Redis max retry attempts reached');
            return undefined;
          }
          return Math.min(options.attempt * 100, 3000);
        }
      });

      this.client.on('error', (error) => {
        logger.error('Erro Redis:', error);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logger.info('Conectado ao Redis');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        logger.info('Redis pronto para uso');
        this.isConnected = true;
      });

      this.client.on('end', () => {
        logger.warn('Conexão Redis encerrada');
        this.isConnected = false;
      });

      await this.client.connect();
      
    } catch (error) {
      logger.error('Erro ao conectar com Redis:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.client) {
        await this.client.disconnect();
        this.isConnected = false;
        logger.info('Desconectado do Redis');
      }
    } catch (error) {
      logger.error('Erro ao desconectar do Redis:', error);
      throw error;
    }
  }

  getClient() {
    if (!this.client || !this.isConnected) {
      throw new Error('Redis não está conectado');
    }
    return this.client;
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      status: this.client ? this.client.status : 'disconnected',
    };
  }

  // Métodos de conveniência
  async set(key, value, ttl = null) {
    const client = this.getClient();
    if (ttl) {
      return await client.setEx(key, ttl, JSON.stringify(value));
    }
    return await client.set(key, JSON.stringify(value));
  }

  async get(key) {
    const client = this.getClient();
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async del(key) {
    const client = this.getClient();
    return await client.del(key);
  }

  async exists(key) {
    const client = this.getClient();
    return await client.exists(key);
  }

  async expire(key, ttl) {
    const client = this.getClient();
    return await client.expire(key, ttl);
  }
}

const redisConnection = new RedisConnection();

module.exports = {
  connectRedis: () => redisConnection.connect(),
  disconnectRedis: () => redisConnection.disconnect(),
  getRedisStatus: () => redisConnection.getConnectionStatus(),
  redisClient: redisConnection,
};
