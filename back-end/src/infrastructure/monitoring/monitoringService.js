const { logger, logAudit, logSecurity } = require('./logging/logger');

class MonitoringService {
  constructor() {
    this.startTime = Date.now();
    this.requestCount = 0;
    this.errorCount = 0;
    this.activeConnections = 0;
    this.performanceMetrics = new Map();
  }

  // Monitoramento de requisições HTTP
  trackHttpRequest(req, res, next) {
    const startTime = Date.now();
    this.requestCount++;

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const route = req.route ? req.route.path : req.path;
      
      // Log da requisição
      logger.info('HTTP Request', {
        method: req.method,
        route,
        statusCode: res.statusCode,
        duration,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
      });

      // Auditoria para ações importantes
      if (this.isAuditableAction(req.method, route)) {
        logAudit('HTTP_REQUEST', req.user?.userId || 'anonymous', {
          method: req.method,
          route,
          statusCode: res.statusCode,
          duration,
          ip: req.ip,
        });
      }

      // Detecção de requisições lentas
      if (duration > 5000) {
        logger.warn('Slow request detected', {
          method: req.method,
          route,
          duration,
          ip: req.ip,
        });
      }

      // Detecção de erros
      if (res.statusCode >= 400) {
        this.errorCount++;
        this.trackError('HTTP_ERROR', {
          method: req.method,
          route,
          statusCode: res.statusCode,
          duration,
          ip: req.ip,
        });
      }
    });

    next();
  }

  // Monitoramento de WebSocket
  trackWebSocketConnection(socket) {
    this.activeConnections++;
    
    logger.info('WebSocket connection established', {
      socketId: socket.id,
      userId: socket.userId,
      userEmail: socket.userEmail,
      activeConnections: this.activeConnections,
      timestamp: new Date().toISOString(),
    });

    socket.on('disconnect', () => {
      this.activeConnections--;
      
      logger.info('WebSocket connection closed', {
        socketId: socket.id,
        userId: socket.userId,
        userEmail: socket.userEmail,
        activeConnections: this.activeConnections,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('error', (error) => {
      this.trackError('WEBSOCKET_ERROR', {
        socketId: socket.id,
        userId: socket.userId,
        error: error.message,
      });
    });
  }

  // Monitoramento de eventos WebSocket
  trackWebSocketEvent(eventType, data) {
    logger.info('WebSocket event', {
      eventType,
      userId: data.userId,
      roomId: data.roomId,
      timestamp: new Date().toISOString(),
    });

    // Auditoria para eventos importantes
    if (this.isAuditableWebSocketEvent(eventType)) {
      logAudit('WEBSOCKET_EVENT', data.userId, {
        eventType,
        roomId: data.roomId,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Monitoramento de banco de dados
  trackDatabaseOperation(operation, collection, duration, success) {
    logger.info('Database operation', {
      operation,
      collection,
      duration,
      success,
      timestamp: new Date().toISOString(),
    });

    if (!success) {
      this.trackError('DATABASE_ERROR', {
        operation,
        collection,
        duration,
      });
    }
  }

  // Monitoramento de cache Redis
  trackCacheOperation(operation, key, hit, duration) {
    logger.info('Cache operation', {
      operation,
      key,
      hit,
      duration,
      timestamp: new Date().toISOString(),
    });
  }

  // Rastreamento de erros
  trackError(errorType, details) {
    this.errorCount++;
    
    logger.error('Application error', {
      errorType,
      details,
      timestamp: new Date().toISOString(),
    });

    // Log de segurança para erros críticos
    if (this.isSecurityError(errorType)) {
      logSecurity('SECURITY_ERROR', {
        errorType,
        details,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Monitoramento de performance
  trackPerformance(operation, duration, metadata = {}) {
    const key = `${operation}_${Date.now()}`;
    this.performanceMetrics.set(key, {
      operation,
      duration,
      metadata,
      timestamp: new Date().toISOString(),
    });

    // Limpar métricas antigas (manter apenas últimas 1000)
    if (this.performanceMetrics.size > 1000) {
      const oldestKey = this.performanceMetrics.keys().next().value;
      this.performanceMetrics.delete(oldestKey);
    }

    logger.info('Performance metric', {
      operation,
      duration,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }

  // Monitoramento de recursos do sistema
  trackSystemResources() {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    logger.info('System resources', {
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
      },
      cpu: cpuUsage,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  }

  // Obter estatísticas
  getStats() {
    return {
      uptime: Date.now() - this.startTime,
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      activeConnections: this.activeConnections,
      errorRate: this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0,
      performanceMetrics: Array.from(this.performanceMetrics.values()).slice(-10),
    };
  }

  // Verificar se ação é auditável
  isAuditableAction(method, route) {
    const auditableMethods = ['POST', 'PUT', 'DELETE'];
    const auditableRoutes = ['/api/users', '/api/rooms', '/api/chat'];
    
    return auditableMethods.includes(method) && 
           auditableRoutes.some(auditableRoute => route.startsWith(auditableRoute));
  }

  // Verificar se evento WebSocket é auditável
  isAuditableWebSocketEvent(eventType) {
    const auditableEvents = ['join_room', 'send_message', 'leave_room'];
    return auditableEvents.includes(eventType);
  }

  // Verificar se erro é de segurança
  isSecurityError(errorType) {
    const securityErrors = ['AUTHENTICATION_ERROR', 'AUTHORIZATION_ERROR', 'RATE_LIMIT_EXCEEDED'];
    return securityErrors.includes(errorType);
  }

  // Iniciar monitoramento periódico
  startPeriodicMonitoring() {
    // Monitoramento de recursos a cada 5 minutos
    setInterval(() => {
      this.trackSystemResources();
    }, 5 * 60 * 1000);

    // Log de estatísticas a cada hora
    setInterval(() => {
      const stats = this.getStats();
      logger.info('Application statistics', stats);
    }, 60 * 60 * 1000);
  }
}

const monitoringService = new MonitoringService();

module.exports = {
  monitoringService,
  trackHttpRequest: (req, res, next) => monitoringService.trackHttpRequest(req, res, next),
  trackWebSocketConnection: (socket) => monitoringService.trackWebSocketConnection(socket),
  trackWebSocketEvent: (eventType, data) => monitoringService.trackWebSocketEvent(eventType, data),
  trackDatabaseOperation: (operation, collection, duration, success) => 
    monitoringService.trackDatabaseOperation(operation, collection, duration, success),
  trackCacheOperation: (operation, key, hit, duration) => 
    monitoringService.trackCacheOperation(operation, key, hit, duration),
  trackError: (errorType, details) => monitoringService.trackError(errorType, details),
  trackPerformance: (operation, duration, metadata) => 
    monitoringService.trackPerformance(operation, duration, metadata),
  getStats: () => monitoringService.getStats(),
  startPeriodicMonitoring: () => monitoringService.startPeriodicMonitoring(),
};
