const { Server } = require('socket.io');
const { logger } = require('../logging/logger');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupEventHandlers();
    
    logger.info('Socket.IO inicializado');
  }

  setupEventHandlers() {
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
  }

  getConnectedUsers() {
    return Array.from(this.connectedUsers.values());
  }

  sendToRoom(roomId, event, data) {
    this.io.to(roomId).emit(event, data);
  }
}

const socketService = new SocketService();

module.exports = {
  initializeSocket: (server) => socketService.initialize(server),
  getSocketService: () => socketService,
};