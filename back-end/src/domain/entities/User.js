const { v4: uuidv4 } = require('uuid');

class User {
  constructor({ name, email, dateBirthDay }) {
    this.validateInput({ name, email, dateBirthDay });
    
    this.id = uuidv4();
    this.name = name;
    this.email = email;
    this.dateBirthDay = dateBirthDay;
    this.createdAt = new Date().toISOString();
    this.status = 'offline';
    this.lastActivity = null;
    this.rooms = [];
    this.messageCount = 0;
    this.preferences = {
      notifications: {
        email: true,
        push: true,
        sound: true
      },
      theme: 'light'
    };
  }

  validateInput({ name, email, dateBirthDay }) {
    if (!name || name.trim() === '') {
      throw new Error('Name is required');
    }
    if (!email) {
      throw new Error('Email is required');
    }
    if (!dateBirthDay) {
      throw new Error('Date of birth is required');
    }
    if (name.length > 50) {
      throw new Error('Name cannot exceed 50 characters');
    }
    if (!User.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    if (!User.isValidDate(dateBirthDay)) {
      throw new Error('Invalid date format');
    }
    if (new Date(dateBirthDay) > new Date()) {
      throw new Error('Date of birth cannot be in the future');
    }
  }

  setOnline() {
    this.status = 'online';
    this.updateLastActivity();
  }

  setOffline() {
    this.status = 'offline';
  }

  isOnline() {
    return this.status === 'online';
  }

  isOffline() {
    return this.status === 'offline';
  }

  updateLastActivity() {
    this.lastActivity = new Date().toISOString();
  }

  updateName(newName) {
    if (newName && newName.trim() !== '') {
      this.name = newName.trim();
    }
  }

  updateEmail(newEmail) {
    if (User.isValidEmail(newEmail)) {
      this.email = newEmail;
    }
  }

  calculateAge() {
    const currentYear = new Date().getFullYear();
    const birthYear = new Date(this.dateBirthDay).getFullYear();
    return currentYear - birthYear;
  }

  joinRoom(roomName) {
    if (!this.rooms.includes(roomName)) {
      this.rooms.push(roomName);
    }
  }

  leaveRoom(roomName) {
    this.rooms = this.rooms.filter(room => room !== roomName);
  }

  isInRoom(roomName) {
    return this.rooms.includes(roomName);
  }

  getRoomCount() {
    return this.rooms.length;
  }

  incrementMessageCount() {
    this.messageCount++;
  }

  resetMessageCount() {
    this.messageCount = 0;
  }

  getMessageCount() {
    return this.messageCount;
  }

  setNotificationPreference(type, enabled) {
    if (this.preferences.notifications[type] !== undefined) {
      this.preferences.notifications[type] = enabled;
    }
  }

  getNotificationPreference(type) {
    return this.preferences.notifications[type];
  }

  setTheme(theme) {
    if (['light', 'dark'].includes(theme)) {
      this.preferences.theme = theme;
    }
  }

  getTheme() {
    return this.preferences.theme;
  }

  static fromJSON(json) {
    const user = new User({
      name: json.name,
      email: json.email,
      dateBirthDay: json.dateBirthDay
    });
    
    user.id = json.id;
    user.createdAt = json.createdAt;
    user.status = json.status;
    user.lastActivity = json.lastActivity;
    user.rooms = json.rooms || [];
    user.messageCount = json.messageCount || 0;
    user.preferences = json.preferences || user.preferences;
    
    return user;
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }
}

module.exports = User;
