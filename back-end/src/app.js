const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import routes
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const adminRoutes = require('./routes/adminRoutes');

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.server = require('http').createServer(this.app);

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSocket();
  }

  initializeMiddlewares() {
    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    }));

    // Security headers
    
    this.app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      next();
    });

    // Static files
    this.app.use(express.static('public'));

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initializeRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
      });
    });

    // Admin dashboard
    this.app.get('/admin', (req, res) => {
      res.sendFile(path.join(__dirname, '../views/admin.html'));
    });

    // Admin dashboard
    this.app.use('/admin', adminRoutes);

    // API routes
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/rooms', roomRoutes);
    this.app.use('/api/chat', chatRoutes);

    // Swagger documentation
    this.app.get('/api-docs', (req, res) => {
      res.json({ 
        message: 'Swagger UI disponível em /api-docs/',
        swagger: 'swagger-ui'
      });
    });

    // Redirect /docs to /api-docs
    this.app.get('/docs', (req, res) => {
      res.redirect('/api-docs');
    });

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({ 
        message: 'Chat API v2.0.0', 
        admin: '/admin',
        health: '/health',
        documentation: '/api-docs'
      });
    });
  }


  initializeSocket() {
    this.io = new Server(this.server, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.io.on('connection', (socket) => {
      console.log(`Usuário conectado: ${socket.id}`);
      
      // Evento: Enviar mensagem
      socket.on('send_message', (data) => {
        socket.broadcast.emit('receive_message', data);
      });

      // Evento: Digitação
      socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
      });

      // Evento: Parar de digitar
      socket.on('stop_typing', (data) => {
        socket.broadcast.emit('stop_typing', data);
      });

      // Evento: Desconectar
      socket.on('disconnect', () => {
        console.log(`Usuário desconectado: ${socket.id}`);
      });
    });

    console.log('Socket.IO inicializado');
  }

  async start() {
    this.server.listen(this.port, () => {
      console.log(`Servidor rodando na porta ${this.port}`);
    });
  }
}

// Export the class for testing
module.exports = App;

// Start application only if this file is run directly
if (require.main === module) {
  const app = new App();
  app.start();
}