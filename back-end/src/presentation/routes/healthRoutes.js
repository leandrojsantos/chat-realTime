const express = require('express');
const router = express.Router();
const { logger } = require('../../infrastructure/logging/logger');
const { getDatabaseStatus } = require('../../infrastructure/database/connection');
const { getRedisStatus } = require('../../infrastructure/cache/redis');
const { getSocketService } = require('../../infrastructure/websocket/socketService');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check da aplicação
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Aplicação saudável
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 services:
 *                   type: object
 *                   properties:
 *                     database:
 *                       type: object
 *                     redis:
 *                       type: object
 *                     websocket:
 *                       type: object
 */
router.get('/', async (req, res) => {
  try {
    const databaseStatus = getDatabaseStatus();
    const redisStatus = getRedisStatus();
    const socketService = getSocketService();
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      services: {
        database: databaseStatus,
        redis: redisStatus,
        websocket: {
          connectedUsers: socketService.getConnectedUsers().length,
        },
      },
    };

    // Verificar se todos os serviços estão funcionando
    const isHealthy = databaseStatus.isConnected && redisStatus.isConnected;
    
    if (!isHealthy) {
      healthStatus.status = 'unhealthy';
      return res.status(503).json(healthStatus);
    }

    res.json(healthStatus);
  } catch (error) {
    logger.error('Erro no health check:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness check da aplicação
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Aplicação pronta
 *       503:
 *         description: Aplicação não está pronta
 */
router.get('/ready', async (req, res) => {
  try {
    const databaseStatus = getDatabaseStatus();
    const redisStatus = getRedisStatus();
    
    const isReady = databaseStatus.isConnected && redisStatus.isConnected;
    
    if (isReady) {
      res.json({ status: 'ready', timestamp: new Date().toISOString() });
    } else {
      res.status(503).json({ 
        status: 'not ready', 
        timestamp: new Date().toISOString(),
        services: {
          database: databaseStatus.isConnected,
          redis: redisStatus.isConnected,
        }
      });
    }
  } catch (error) {
    logger.error('Erro no readiness check:', error);
    res.status(503).json({ 
      status: 'not ready', 
      timestamp: new Date().toISOString(),
      error: error.message 
    });
  }
});

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness check da aplicação
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Aplicação viva
 */
router.get('/live', (req, res) => {
  res.json({ 
    status: 'alive', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;
