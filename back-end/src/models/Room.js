// Modelo de sala de chat
class Room {
  constructor(name, createdBy) {
    this.name = name;
    this.createdBy = createdBy;
    this.createdAt = new Date();
    this.participants = new Set();
    this.messages = [];
    this.id = this.generateId();
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  addParticipant(userId) {
    this.participants.add(userId);
  }

  removeParticipant(userId) {
    this.participants.delete(userId);
  }

  addMessage(message) {
    this.messages.push(message);
    // Manter apenas as últimas 100 mensagens para performance
    if (this.messages.length > 100) {
      this.messages = this.messages.slice(-100);
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      participantsCount: this.participants.size,
      messagesCount: this.messages.length
    };
  }
}

module.exports = Room;


