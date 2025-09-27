const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const { errorHandler } = require('./middleware/errorHandler');
const { logger } = require('./infrastructure/logging/logger');
const { connectDatabase } = require('./infrastructure/database/connection');
const { connectRedis } = require('./infrastructure/cache/redis');
const { initializeSocket } = require('./infrastructure/websocket/socketService');

// Import routes
const chatRoutes = require('./presentation/routes/chatRoutes');
const userRoutes = require('./presentation/routes/userRoutes');
const roomRoutes = require('./presentation/routes/roomRoutes');
const healthRoutes = require('./presentation/routes/healthRoutes');

// Swagger configuration
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
        url: process.env.API_URL || 'http://localhost:3001',
        description: 'Servidor de desenvolvimento',
      },
    ],
  },
  apis: ['./src/presentation/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.server = require('http').createServer(this.app);
    
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeDatabase();
    this.initializeSocket();
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
      stream: { write: message => logger.info(message.trim()) }
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Muitas requisições deste IP, tente novamente em 15 minutos.',
    });
    this.app.use('/api/', limiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Swagger documentation
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, swaggerUiOptions));
    
    // Redoc documentation
    this.app.use('/redoc', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Chat API - ReDoc</title>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
            <style>
              body { margin: 0; padding: 0; }
            </style>
          </head>
          <body>
            <redoc spec-url='/api-docs/swagger.json'></redoc>
            <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
          </body>
        </html>
      `);
    });
    
    // JSON spec endpoint
    this.app.get('/api-docs/swagger.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpecs);
    });
  }

  initializeRoutes() {
    // Health check
    this.app.use('/health', healthRoutes);
    
    // API routes
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/rooms', roomRoutes);
    this.app.use('/api/chat', chatRoutes);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Chat API v2.0.0',
        documentation: '/api-docs',
        health: '/health'
      });
    });
  }

  initializeErrorHandling() {
    this.app.use(errorHandler);
  }

  async initializeDatabase() {
    try {
      await connectDatabase();
      await connectRedis();
      logger.info('Conexões com banco de dados e cache estabelecidas');
    } catch (error) {
      logger.error('Erro ao conectar com banco de dados:', error);
      process.exit(1);
    }
  }

  initializeSocket() {
    initializeSocket(this.server);
  }

  async start() {
    try {
      this.server.listen(this.port, () => {
        logger.info(`Servidor rodando na porta ${this.port}`);
        logger.info(`Documentação disponível em http://localhost:${this.port}/api-docs`);
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

// Start application
const app = new App();
app.start();

module.exports = app;
