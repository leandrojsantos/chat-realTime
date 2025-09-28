const express = require('express');
const router = express.Router();
const { logger } = require('../../infrastructure/logging/logger');

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
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };

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
    res.json({ status: 'ready', timestamp: new Date().toISOString() });
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
 *       503:
 *         description: Aplicação não está viva
 */
router.get('/live', (req, res) => {
  try {
    res.json({ status: 'live', timestamp: new Date().toISOString() });
  } catch (error) {
    logger.error('Erro no liveness check:', error);
    res.status(503).json({ 
      status: 'not live', 
      timestamp: new Date().toISOString(),
      error: error.message 
    });
  }
});

module.exports = router;