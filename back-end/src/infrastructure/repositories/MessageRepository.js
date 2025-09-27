const mongoose = require('mongoose');
const Message = require('../../domain/entities/Message');

const messageSchema = new mongoose.Schema({
  _id: { type: String, default: () => require('uuid').v4() },
  content: { type: String, required: true, minlength: 1, maxlength: 2000 },
  userId: { type: String, required: true, ref: 'User' },
  roomId: { type: String, required: true, ref: 'Room' },
  messageType: { 
    type: String, 
    enum: ['text', 'image', 'file', 'system'], 
    default: 'text' 
  },
  isEdited: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

messageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Índices para performance
messageSchema.index({ roomId: 1, createdAt: -1 });
messageSchema.index({ userId: 1 });
messageSchema.index({ createdAt: -1 });

const MessageModel = mongoose.model('Message', messageSchema);

class MessageRepository {
  async create(message) {
    try {
      const messageData = message.toJSON();
      const createdMessage = await MessageModel.create(messageData);
      return Message.fromJSON(createdMessage.toObject());
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      const message = await MessageModel.findById(id);
      return message ? Message.fromJSON(message.toObject()) : null;
    } catch (error) {
      throw error;
    }
  }

  async findByRoomId(roomId, limit = 50, offset = 0) {
    try {
      const messages = await MessageModel.find({ roomId })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);
      
      return messages.map(message => {
        const messageObj = Message.fromJSON(message.toObject());
        // Adicionar informações do usuário
        messageObj.user = message.userId;
        return messageObj;
      });
    } catch (error) {
      throw error;
    }
  }

  async update(id, message) {
    try {
      const messageData = message.toJSON();
      const updatedMessage = await MessageModel.findByIdAndUpdate(
        id,
        { ...messageData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      
      if (!updatedMessage) {
        throw new Error('Mensagem não encontrada');
      }
      
      return Message.fromJSON(updatedMessage.toObject());
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const result = await MessageModel.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Mensagem não encontrada');
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async findRecentMessages(roomId, limit = 20) {
    try {
      const messages = await MessageModel.find({ roomId })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit);
      
      return messages.map(message => {
        const messageObj = Message.fromJSON(message.toObject());
        messageObj.user = message.userId;
        return messageObj;
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MessageRepository;
