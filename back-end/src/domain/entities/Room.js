const { v4: uuidv4 } = require('uuid');

class Room {
  constructor({ name, description = '', type }) {
    this.validateInput({ name, type });
    
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.type = type;
    this.createdAt = new Date().toISOString();
    this.users = [];
    this.messages = [];
    this.status = 'active';
  }

  validateInput({ name, type }) {
    if (!name || name.trim() === '') {
      throw new Error('Name is required');
    }
    if (!type) {
      throw new Error('Type is required');
    }
    if (name.length > 50) {
      throw new Error('Name cannot exceed 50 characters');
    }
    if (!Room.isValidType(type)) {
      throw new Error('Invalid room type');
    }
  }

  addUser(user) {
    if (!this.hasUser(user.id)) {
      this.users.push(user);
    }
  }

  removeUser(userId) {
    this.users = this.users.filter(user => user.id !== userId);
  }

  hasUser(userId) {
    return this.users.some(user => user.id === userId);
  }

  getUserCount() {
    return this.users.length;
  }

  addMessage(message) {
    this.messages.push(message);
  }

  getRecentMessages(limit = 10) {
    return this.messages
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  getMessageCount() {
    return this.messages.length;
  }

  updateName(newName) {
    if (newName && newName.trim() !== '') {
      this.name = newName.trim();
    }
  }

  updateDescription(newDescription) {
    this.description = newDescription || '';
  }

  setPrivate() {
    this.type = 'private';
  }

  setPublic() {
    this.type = 'public';
  }

  isPrivate() {
    return this.type === 'private';
  }

  isPublic() {
    return this.type === 'public';
  }

  activate() {
    this.status = 'active';
  }

  deactivate() {
    this.status = 'inactive';
  }

  isActive() {
    return this.status === 'active';
  }

  static fromJSON(json) {
    const room = new Room({
      name: json.name,
      description: json.description,
      type: json.type
    });
    
    room.id = json.id;
    room.createdAt = json.createdAt;
    room.users = json.users || [];
    room.messages = json.messages || [];
    room.status = json.status || 'active';
    
    return room;
  }

  static isValidType(type) {
    const validTypes = ['public', 'private'];
    return validTypes.includes(type);
  }
}

module.exports = Room;
