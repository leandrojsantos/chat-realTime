const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { logger, logSecurity } = require('./logging/logger');

class SecurityService {
  constructor() {
    this.setupHelmet();
    this.setupRateLimiting();
    this.setupSecurityHeaders();
  }

  // Configuração do Helmet para headers de segurança
  setupHelmet() {
    this.helmetConfig = helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "ws:", "wss:"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    });
  }

  // Configuração de rate limiting
  setupRateLimiting() {
    // Rate limiting geral
    this.generalLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // máximo 100 requisições por IP
      message: {
        error: 'Muitas requisições deste IP, tente novamente em 15 minutos.',
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        logSecurity('RATE_LIMIT_EXCEEDED', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          url: req.url,
          method: req.method,
        });
        res.status(429).json({
          error: 'Muitas requisições deste IP, tente novamente em 15 minutos.',
        });
      },
    });

    // Rate limiting para autenticação
    this.authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 5, // máximo 5 tentativas de login
      message: {
        error: 'Muitas tentativas de login, tente novamente em 15 minutos.',
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        logSecurity('AUTH_RATE_LIMIT_EXCEEDED', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          body: req.body,
        });
        res.status(429).json({
          error: 'Muitas tentativas de login, tente novamente em 15 minutos.',
        });
      },
    });

    // Rate limiting para criação de usuários
    this.userCreationLimiter = rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hora
      max: 10, // máximo 10 criações de usuário por hora
      message: {
        error: 'Muitas criações de usuário, tente novamente em uma hora.',
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        logSecurity('USER_CREATION_RATE_LIMIT_EXCEEDED', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          body: req.body,
        });
        res.status(429).json({
          error: 'Muitas criações de usuário, tente novamente em uma hora.',
        });
      },
    });

    // Rate limiting para envio de mensagens
    this.messageLimiter = rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minuto
      max: 30, // máximo 30 mensagens por minuto
      message: {
        error: 'Muitas mensagens enviadas, aguarde um momento.',
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        logSecurity('MESSAGE_RATE_LIMIT_EXCEEDED', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          body: req.body,
        });
        res.status(429).json({
          error: 'Muitas mensagens enviadas, aguarde um momento.',
        });
      },
    });
  }

  // Headers de segurança customizados
  setupSecurityHeaders() {
    this.securityHeaders = (req, res, next) => {
      // Remover header X-Powered-By
      res.removeHeader('X-Powered-By');
      
      // Headers customizados
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
      
      next();
    };
  }

  // Validação de entrada
  validateInput(req, res, next) {
    // Verificar tamanho do body
    const contentLength = req.get('content-length');
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB
      logSecurity('REQUEST_TOO_LARGE', {
        ip: req.ip,
        contentLength,
        url: req.url,
      });
      return res.status(413).json({
        error: 'Request too large',
      });
    }

    // Verificar User-Agent suspeito
    const userAgent = req.get('User-Agent');
    if (this.isSuspiciousUserAgent(userAgent)) {
      logSecurity('SUSPICIOUS_USER_AGENT', {
        ip: req.ip,
        userAgent,
        url: req.url,
      });
    }

    next();
  }

  // Detecção de User-Agent suspeito
  isSuspiciousUserAgent(userAgent) {
    if (!userAgent) return true;
    
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i,
      /php/i,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  // Validação de IP
  validateIP(req, res, next) {
    const ip = req.ip;
    
    // Verificar se IP está em blacklist (implementar conforme necessário)
    if (this.isBlacklistedIP(ip)) {
      logSecurity('BLACKLISTED_IP_ACCESS', {
        ip,
        url: req.url,
        userAgent: req.get('User-Agent'),
      });
      return res.status(403).json({
        error: 'Access denied',
      });
    }

    next();
  }

  // Verificar se IP está em blacklist
  isBlacklistedIP(ip) {
    // Implementar lógica de blacklist conforme necessário
    // Por exemplo, consultar banco de dados ou arquivo
    return false;
  }

  // Sanitização de dados
  sanitizeInput(data) {
    if (typeof data === 'string') {
      // Remover caracteres potencialmente perigosos
      return data
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }
    
    return data;
  }

  // Middleware de sanitização
  sanitizeMiddleware(req, res, next) {
    if (req.body) {
      req.body = this.sanitizeInput(req.body);
    }
    if (req.query) {
      req.query = this.sanitizeInput(req.query);
    }
    if (req.params) {
      req.params = this.sanitizeInput(req.params);
    }
    next();
  }

  // Detecção de ataques comuns
  detectAttack(req, res, next) {
    const url = req.url.toLowerCase();
    const body = JSON.stringify(req.body).toLowerCase();
    
    // Detecção de SQL injection
    const sqlPatterns = [
      /union\s+select/i,
      /drop\s+table/i,
      /delete\s+from/i,
      /insert\s+into/i,
      /update\s+set/i,
      /or\s+1\s*=\s*1/i,
    ];

    // Detecção de XSS
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
    ];

    // Verificar padrões suspeitos
    const suspiciousPatterns = [...sqlPatterns, ...xssPatterns];
    const isSuspicious = suspiciousPatterns.some(pattern => 
      pattern.test(url) || pattern.test(body)
    );

    if (isSuspicious) {
      logSecurity('SUSPICIOUS_REQUEST', {
        ip: req.ip,
        url: req.url,
        method: req.method,
        body: req.body,
        userAgent: req.get('User-Agent'),
      });
      
      return res.status(400).json({
        error: 'Invalid request',
      });
    }

    next();
  }

  // Obter configurações de segurança
  getSecurityConfig() {
    return {
      helmet: this.helmetConfig,
      generalLimiter: this.generalLimiter,
      authLimiter: this.authLimiter,
      userCreationLimiter: this.userCreationLimiter,
      messageLimiter: this.messageLimiter,
      securityHeaders: this.securityHeaders,
      validateInput: this.validateInput.bind(this),
      validateIP: this.validateIP.bind(this),
      sanitizeMiddleware: this.sanitizeMiddleware.bind(this),
      detectAttack: this.detectAttack.bind(this),
    };
  }
}

const securityService = new SecurityService();

module.exports = {
  securityService,
  getSecurityConfig: () => securityService.getSecurityConfig(),
};
