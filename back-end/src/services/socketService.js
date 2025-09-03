// Serviço de Socket.IO
const Message = require('../models/Message');
const Room = require('../models/Room');

class SocketService {
  constructor(io) {
    this.io = io;
    this.rooms = new Map(); // Map para armazenar salas
    this.users = new Map(); // Map para armazenar usuários conectados
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Usuário conectado: ${socket.id}`);
      
      // Eventos do socket
      socket.on('join_room', (data) => this.handleJoinRoom(socket, data));
      socket.on('send_message', (data) => this.handleSendMessage(socket, data));
      socket.on('leave_room', (data) => this.handleLeaveRoom(socket, data));
      socket.on('disconnect', () => this.handleDisconnect(socket));
    });
  }

  handleJoinRoom(socket, data) {
    const { room, username, email, dateBirthDay } = data;
    
    if (!room || !username) {
      socket.emit('error', { message: 'Sala e nome de usuário são obrigatórios' });
      return;
    }

    // Criar sala se não existir
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Room(room, username));
    }

    const roomInstance = this.rooms.get(room);
    roomInstance.addParticipant(socket.id);

    // Armazenar informações do usuário
    this.users.set(socket.id, {
      username,
      email,
      dateBirthDay,
      currentRoom: room
    });

    socket.join(room);
    
    // Notificar outros usuários na sala
    socket.to(room).emit('user_joined', {
      username,
      room,
      participantsCount: roomInstance.participants.size
    });

    // Enviar histórico de mensagens da sala
    socket.emit('room_history', {
      room,
      messages: roomInstance.messages,
      participantsCount: roomInstance.participants.size
    });

    console.log(`Usuário ${username} entrou na sala: ${room}`);
  }

  handleSendMessage(socket, data) {
    const { room, author, email, dateBirthDay, message } = data;
    
    if (!room || !message || !author) {
      socket.emit('error', { message: 'Dados da mensagem incompletos' });
      return;
    }

    const time = new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const messageInstance = new Message(room, author, email, dateBirthDay, message, time);
    
    // Adicionar mensagem à sala
    if (this.rooms.has(room)) {
      this.rooms.get(room).addMessage(messageInstance);
    }

    // Enviar mensagem para todos na sala
    this.io.to(room).emit('receive_message', messageInstance.toJSON());
    
    console.log(`Mensagem enviada na sala ${room} por ${author}: ${message}`);
  }

  handleLeaveRoom(socket, data) {
    const { room } = data;
    const user = this.users.get(socket.id);
    
    if (user && room) {
      socket.leave(room);
      
      if (this.rooms.has(room)) {
        this.rooms.get(room).removeParticipant(socket.id);
        
        // Notificar outros usuários
        socket.to(room).emit('user_left', {
          username: user.username,
          room,
          participantsCount: this.rooms.get(room).participants.size
        });
      }
      
      user.currentRoom = null;
      console.log(`Usuário ${user.username} saiu da sala: ${room}`);
    }
  }

  handleDisconnect(socket) {
    const user = this.users.get(socket.id);
    
    if (user && user.currentRoom) {
      this.handleLeaveRoom(socket, { room: user.currentRoom });
    }
    
    this.users.delete(socket.id);
    console.log(`Usuário desconectado: ${socket.id}`);
  }

  // Métodos utilitários
  getRoomInfo(roomName) {
    return this.rooms.get(roomName);
  }

  getConnectedUsers() {
    return Array.from(this.users.values());
  }

  getRoomsList() {
    return Array.from(this.rooms.values()).map(room => room.toJSON());
  }
}

module.exports = SocketService;


