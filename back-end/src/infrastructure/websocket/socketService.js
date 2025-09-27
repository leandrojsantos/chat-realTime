const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { logger, logAudit } = require('./logging/logger');
const { redisClient } = require('./cache/redis');

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

    this.setupMiddleware();
    this.setupEventHandlers();
    
    logger.info('Socket.IO inicializado');
  }

  setupMiddleware() {
    // Middleware de autenticação
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Token de autenticação necessário'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        socket.userId = decoded.userId;
        socket.userEmail = decoded.email;
        next();
      } catch (error) {
        logger.error('Erro na autenticação do socket:', error);
        next(new Error('Token inválido'));
      }
    });
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      logger.info(`Usuário conectado: ${socket.userEmail} (${socket.id})`);
      
      // Armazenar usuário conectado
      this.connectedUsers.set(socket.userId, {
        socketId: socket.id,
        email: socket.userEmail,
        connectedAt: new Date(),
        currentRoom: null,
      });

      // Evento: Entrar em sala
      socket.on('join_room', async (data) => {
        try {
          const { roomId, roomName } = data;
          
          // Deixar sala anterior se existir
          if (socket.currentRoom) {
            socket.leave(socket.currentRoom);
          }

          // Entrar na nova sala
          socket.join(roomId);
          socket.currentRoom = roomId;

          // Atualizar informações do usuário
          const userInfo = this.connectedUsers.get(socket.userId);
          if (userInfo) {
            userInfo.currentRoom = roomId;
            this.connectedUsers.set(socket.userId, userInfo);
          }

          // Notificar outros usuários na sala
          socket.to(roomId).emit('user_joined', {
            userId: socket.userId,
            userEmail: socket.userEmail,
            message: `${socket.userEmail} entrou na sala`,
            timestamp: new Date(),
          });

          // Enviar histórico de mensagens para o usuário
          await this.sendRoomHistory(socket, roomId);

          logAudit('USER_JOINED_ROOM', socket.userId, { roomId, roomName });
          logger.info(`Usuário ${socket.userEmail} entrou na sala ${roomName}`);

        } catch (error) {
          logger.error('Erro ao entrar na sala:', error);
          socket.emit('error', { message: 'Erro ao entrar na sala' });
        }
      });

      // Evento: Enviar mensagem
      socket.on('send_message', async (data) => {
        try {
          const { content, roomId, messageType = 'text' } = data;

          // Validar dados
          if (!content || !roomId) {
            socket.emit('error', { message: 'Dados da mensagem inválidos' });
            return;
          }

          // Criar objeto da mensagem
          const message = {
            id: require('uuid').v4(),
            content,
            userId: socket.userId,
            userEmail: socket.userEmail,
            roomId,
            messageType,
            timestamp: new Date(),
          };

          // Enviar mensagem para todos na sala
          this.io.to(roomId).emit('receive_message', message);

          // Salvar no cache Redis
          await this.saveMessageToCache(roomId, message);

          logAudit('MESSAGE_SENT', socket.userId, { roomId, messageId: message.id });
          logger.info(`Mensagem enviada por ${socket.userEmail} na sala ${roomId}`);

        } catch (error) {
          logger.error('Erro ao enviar mensagem:', error);
          socket.emit('error', { message: 'Erro ao enviar mensagem' });
        }
      });

      // Evento: Usuário digitando
      socket.on('typing', (data) => {
        const { roomId, isTyping } = data;
        socket.to(roomId).emit('user_typing', {
          userId: socket.userId,
          userEmail: socket.userEmail,
          isTyping,
        });
      });

      // Evento: Desconectar
      socket.on('disconnect', () => {
        logger.info(`Usuário desconectado: ${socket.userEmail} (${socket.id})`);
        
        // Notificar outros usuários se estava em uma sala
        if (socket.currentRoom) {
          socket.to(socket.currentRoom).emit('user_left', {
            userId: socket.userId,
            userEmail: socket.userEmail,
            message: `${socket.userEmail} saiu da sala`,
            timestamp: new Date(),
          });
        }

        // Remover usuário da lista de conectados
        this.connectedUsers.delete(socket.userId);

        logAudit('USER_DISCONNECTED', socket.userId, { socketId: socket.id });
      });
    });
  }

  async sendRoomHistory(socket, roomId) {
    try {
      // Buscar histórico do cache Redis
      const history = await redisClient.get(`room:${roomId}:messages`);
      if (history) {
        socket.emit('room_history', JSON.parse(history));
      }
    } catch (error) {
      logger.error('Erro ao buscar histórico da sala:', error);
    }
  }

  async saveMessageToCache(roomId, message) {
    try {
      const cacheKey = `room:${roomId}:messages`;
      
      // Buscar mensagens existentes
      let messages = await redisClient.get(cacheKey);
      messages = messages ? JSON.parse(messages) : [];

      // Adicionar nova mensagem
      messages.push(message);

      // Manter apenas as últimas 100 mensagens
      if (messages.length > 100) {
        messages = messages.slice(-100);
      }

      // Salvar no cache com TTL de 24 horas
      await redisClient.set(cacheKey, JSON.stringify(messages), 86400);
    } catch (error) {
      logger.error('Erro ao salvar mensagem no cache:', error);
    }
  }

  getConnectedUsers() {
    return Array.from(this.connectedUsers.values());
  }

  getUsersInRoom(roomId) {
    const room = this.io.sockets.adapter.rooms.get(roomId);
    if (!room) return [];

    return Array.from(room).map(socketId => {
      const socket = this.io.sockets.sockets.get(socketId);
      return socket ? {
        userId: socket.userId,
        userEmail: socket.userEmail,
        socketId: socket.id,
      } : null;
    }).filter(Boolean);
  }

  sendToUser(userId, event, data) {
    const userInfo = this.connectedUsers.get(userId);
    if (userInfo) {
      this.io.to(userInfo.socketId).emit(event, data);
    }
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
