const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const redis = require('redis');
const winston = require('winston');
const path = require('path');

// Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.server = require('http').createServer(this.app);

    this.initializeSwagger();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeDatabase();
    this.initializeSocket();
  }

  initializeSwagger() {
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Chat API',
          version: '2.0.0',
          description: 'API para sistema de chat em tempo real',
        },
        servers: [
          {
            url: `http://localhost:${this.port}`,
            description: 'Servidor de desenvolvimento',
          },
        ],
      },
      apis: ['./src/routes/*.js'],
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  initializeMiddlewares() {
    // Security middleware
    this.app.use(helmet());

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    }));

    // Compression
    this.app.use(compression());

    // Logging
    this.app.use(morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) },
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Muitas requisições deste IP, tente novamente em 15 minutos.',
    });
    this.app.use('/api/', limiter);

    // Static files
    this.app.use(express.static('public'));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
  }

  initializeRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      });
    });

    // Admin dashboard
    this.app.get('/admin', (req, res) => {
      res.sendFile(path.join(__dirname, '../views/admin.html'));
    });

    // API routes
    this.app.use('/api/users', require('./routes/userRoutes'));
    this.app.use('/api/rooms', require('./routes/roomRoutes'));
    this.app.use('/api/chat', require('./routes/chatRoutes'));

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Chat API v2.0.0',
        health: '/health',
        documentation: '/api-docs',
        admin: '/admin',
      });
    });

    // Redirect /docs to /api-docs
    this.app.get('/docs', (req, res) => {
      res.redirect('/api-docs');
    });
  }

  async initializeDatabase() {
    try {
      // MongoDB
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatdb';
      await mongoose.connect(mongoUri);
      logger.info('Conectado ao MongoDB');

      // Redis
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      this.redisClient = redis.createClient({ url: redisUrl });
      await this.redisClient.connect();
      logger.info('Conectado ao Redis');
    } catch (error) {
      logger.error('Erro ao conectar com banco de dados:', error);
      process.exit(1);
    }
  }

  initializeSocket() {
    this.io = new Server(this.server, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.io.on('connection', (socket) => {
      logger.info(`Usuário conectado: ${socket.id}`);
      
      // Evento: Entrar em sala
      socket.on('join_room', (data) => {
        try {
          const { room } = data;
          socket.join(room);
          logger.info(`Usuário ${socket.id} entrou na sala ${room}`);
        } catch (error) {
          logger.error('Erro ao entrar na sala:', error);
          socket.emit('error', { message: 'Erro ao entrar na sala' });
        }
      });

      // Evento: Enviar mensagem
      socket.on('send_message', (data) => {
        try {
          const { room, message, author, email, dateBirthDay, time } = data;
          
          // Enviar mensagem para todos na sala
          socket.to(room).emit('receive_message', {
            room,
            message,
            author,
            email,
            dateBirthDay,
            time
          });
          
          logger.info(`Mensagem enviada na sala ${room} por ${author}`);
        } catch (error) {
          logger.error('Erro ao enviar mensagem:', error);
          socket.emit('error', { message: 'Erro ao enviar mensagem' });
        }
      });

      // Evento: Desconectar
      socket.on('disconnect', () => {
        logger.info(`Usuário desconectado: ${socket.id}`);
      });
    });

    logger.info('Socket.IO inicializado');
  }

  async start() {
    try {
      this.server.listen(this.port, () => {
        logger.info(`Servidor rodando na porta ${this.port}`);
      });
    } catch (error) {
      logger.error('Erro ao iniciar servidor:', error);
      process.exit(1);
    }
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM recebido, encerrando servidor graciosamente');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT recebido, encerrando servidor graciosamente');
  process.exit(0);
});

// Export the class for testing
module.exports = App;

// Start application only if this file is run directly
if (require.main === module) {
  const app = new App();
  app.start();
}