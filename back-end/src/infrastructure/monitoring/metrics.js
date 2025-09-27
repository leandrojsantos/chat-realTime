const prometheus = require('prom-client');
const { logger } = require('./logging/logger');

// Criar Registry do Prometheus
const register = new prometheus.Registry();

// Adicionar métricas padrão
prometheus.collectDefaultMetrics({ register });

// Métricas customizadas
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const websocketConnections = new prometheus.Gauge({
  name: 'websocket_connections_total',
  help: 'Total number of WebSocket connections',
});

const websocketMessagesTotal = new prometheus.Counter({
  name: 'websocket_messages_total',
  help: 'Total number of WebSocket messages',
  labelNames: ['event_type'],
});

const databaseConnections = new prometheus.Gauge({
  name: 'database_connections_active',
  help: 'Number of active database connections',
});

const redisConnections = new prometheus.Gauge({
  name: 'redis_connections_active',
  help: 'Number of active Redis connections',
});

const messageQueueSize = new prometheus.Gauge({
  name: 'message_queue_size',
  help: 'Size of message queue',
});

const errorRate = new prometheus.Counter({
  name: 'application_errors_total',
  help: 'Total number of application errors',
  labelNames: ['error_type', 'severity'],
});

const userRegistrations = new prometheus.Counter({
  name: 'user_registrations_total',
  help: 'Total number of user registrations',
});

const roomCreations = new prometheus.Counter({
  name: 'room_creations_total',
  help: 'Total number of room creations',
});

const messagesSent = new prometheus.Counter({
  name: 'messages_sent_total',
  help: 'Total number of messages sent',
  labelNames: ['room_id'],
});

// Registrar métricas
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(websocketConnections);
register.registerMetric(websocketMessagesTotal);
register.registerMetric(databaseConnections);
register.registerMetric(redisConnections);
register.registerMetric(messageQueueSize);
register.registerMetric(errorRate);
register.registerMetric(userRegistrations);
register.registerMetric(roomCreations);
register.registerMetric(messagesSent);

// Middleware para métricas HTTP
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
    
    httpRequestTotal
      .labels(req.method, route, res.statusCode)
      .inc();
    
    // Log de performance
    if (duration > 1) {
      logger.warn('Slow request detected', {
        method: req.method,
        route,
        duration,
        statusCode: res.statusCode,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
    }
  });
  
  next();
};

// Funções para atualizar métricas
const updateWebSocketConnections = (count) => {
  websocketConnections.set(count);
};

const incrementWebSocketMessages = (eventType) => {
  websocketMessagesTotal.labels(eventType).inc();
};

const updateDatabaseConnections = (count) => {
  databaseConnections.set(count);
};

const updateRedisConnections = (count) => {
  redisConnections.set(count);
};

const updateMessageQueueSize = (size) => {
  messageQueueSize.set(size);
};

const incrementError = (errorType, severity = 'error') => {
  errorRate.labels(errorType, severity).inc();
};

const incrementUserRegistration = () => {
  userRegistrations.inc();
};

const incrementRoomCreation = () => {
  roomCreations.inc();
};

const incrementMessageSent = (roomId) => {
  messagesSent.labels(roomId).inc();
};

// Endpoint para métricas
const getMetrics = async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.end(metrics);
  } catch (error) {
    logger.error('Error getting metrics:', error);
    res.status(500).end('Error getting metrics');
  }
};

// Health check com métricas
const getHealthWithMetrics = async (req, res) => {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      metrics: {
        httpRequests: await httpRequestTotal.get(),
        websocketConnections: await websocketConnections.get(),
        databaseConnections: await databaseConnections.get(),
        redisConnections: await redisConnections.get(),
        messageQueueSize: await messageQueueSize.get(),
        errors: await errorRate.get(),
      },
    };
    
    res.json(healthData);
  } catch (error) {
    logger.error('Error getting health with metrics:', error);
    res.status(500).json({ error: 'Error getting health data' });
  }
};

module.exports = {
  register,
  metricsMiddleware,
  updateWebSocketConnections,
  incrementWebSocketMessages,
  updateDatabaseConnections,
  updateRedisConnections,
  updateMessageQueueSize,
  incrementError,
  incrementUserRegistration,
  incrementRoomCreation,
  incrementMessageSent,
  getMetrics,
  getHealthWithMetrics,
};
