// Modelo de mensagem
class Message {
  constructor(room, author, email, dateBirthDay, message, time) {
    this.room = room;
    this.author = author;
    this.email = email;
    this.dateBirthDay = dateBirthDay;
    this.message = message;
    this.time = time;
    this.id = this.generateId();
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  toJSON() {
    return {
      id: this.id,
      room: this.room,
      author: this.author,
      email: this.email,
      dateBirthDay: this.dateBirthDay,
      message: this.message,
      time: this.time
    };
  }
}

module.exports = Message;

