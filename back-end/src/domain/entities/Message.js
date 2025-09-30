const { v4: uuidv4 } = require('uuid');

class Message {
  constructor({ content, author, room, type = 'text' }) {
    this.validateInput({ content, author, room, type });
    
    this.id = uuidv4();
    this.content = content;
    this.author = author;
    this.room = room;
    this.type = type;
    this.timestamp = new Date().toISOString();
    this.deleted = false;
    this.deletedAt = null;
  }

  validateInput({ content, author, room, type }) {
    if (!content || content.trim() === '') {
      throw new Error('Content is required');
    }
    if (!author || author.trim() === '') {
      throw new Error('Author is required');
    }
    if (!room || room.trim() === '') {
      throw new Error('Room is required');
    }
    if (content.length > 1000) {
      throw new Error('Content cannot exceed 1000 characters');
    }
    if (author.length > 50) {
      throw new Error('Author cannot exceed 50 characters');
    }
    if (room.length > 50) {
      throw new Error('Room cannot exceed 50 characters');
    }
    if (!Message.isValidType(type)) {
      throw new Error('Invalid message type');
    }
  }

  updateContent(newContent) {
    if (newContent && newContent.trim() !== '' && newContent.length <= 1000) {
      this.content = newContent.trim();
    }
  }

  markAsDeleted() {
    this.deleted = true;
    this.deletedAt = new Date().toISOString();
  }

  isDeleted() {
    return this.deleted;
  }

  toJSON() {
    return {
      id: this.id,
      content: this.content,
      author: this.author,
      room: this.room,
      type: this.type,
      timestamp: this.timestamp,
      deleted: this.deleted,
      deletedAt: this.deletedAt
    };
  }

  static fromJSON(json) {
    const message = new Message({
      content: json.content,
      author: json.author,
      room: json.room,
      type: json.type
    });
    
    message.id = json.id;
    message.timestamp = json.timestamp;
    message.deleted = json.deleted || false;
    message.deletedAt = json.deletedAt;
    
    return message;
  }

  static isValidType(type) {
    const validTypes = ['text', 'image', 'file', 'system'];
    return validTypes.includes(type);
  }
}

module.exports = Message;
