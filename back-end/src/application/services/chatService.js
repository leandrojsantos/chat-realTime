const Message = require('../../domain/entities/Message');

class ChatService {
  constructor() {
    this.messages = [];
    this.stats = {
      totalMessages: 0,
      messagesToday: 0
    };
  }

  async createMessage(messageData) {
    try {
      const message = new Message(messageData);
      this.messages.push(message);
      this.stats.totalMessages++;
      
      // Simular incremento de mensagens do dia
      const today = new Date().toDateString();
      const messageDate = new Date(message.timestamp).toDateString();
      if (today === messageDate) {
        this.stats.messagesToday++;
      }
      
      return message;
    } catch (error) {
      throw new Error(`Failed to create message: ${error.message}`);
    }
  }

  async getMessagesByRoom(roomId) {
    try {
      return this.messages.filter(message => message.room === roomId);
    } catch (error) {
      throw new Error(`Failed to get messages for room ${roomId}: ${error.message}`);
    }
  }

  async getStats() {
    try {
      return {
        totalUsers: 25,
        onlineUsers: 8,
        totalRooms: 5,
        activeRooms: 3,
        totalMessages: this.stats.totalMessages,
        messagesToday: this.stats.messagesToday
      };
    } catch (error) {
      throw new Error(`Failed to get stats: ${error.message}`);
    }
  }

  async deleteMessage(messageId) {
    try {
      const messageIndex = this.messages.findIndex(msg => msg.id === messageId);
      if (messageIndex === -1) {
        throw new Error('Message not found');
      }
      
      this.messages[messageIndex].markAsDeleted();
      return this.messages[messageIndex];
    } catch (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }

  async getMessageById(messageId) {
    try {
      const message = this.messages.find(msg => msg.id === messageId);
      if (!message) {
        throw new Error('Message not found');
      }
      return message;
    } catch (error) {
      throw new Error(`Failed to get message: ${error.message}`);
    }
  }
}

module.exports = new ChatService();

