const mongoose = require('mongoose');
const Room = require('../../domain/entities/Room');

const roomSchema = new mongoose.Schema({
  _id: { type: String, default: () => require('uuid').v4() },
  name: { type: String, required: true, unique: true, minlength: 2, maxlength: 50 },
  description: { type: String, required: true, minlength: 5, maxlength: 200 },
  maxUsers: { type: Number, default: 50, min: 2, max: 1000 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

roomSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const RoomModel = mongoose.model('Room', roomSchema);

class RoomRepository {
  async create(room) {
    try {
      const roomData = room.toJSON();
      const createdRoom = await RoomModel.create(roomData);
      return Room.fromJSON(createdRoom.toObject());
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Nome da sala já está em uso');
      }
      throw error;
    }
  }

  async findById(id) {
    try {
      const room = await RoomModel.findById(id);
      return room ? Room.fromJSON(room.toObject()) : null;
    } catch (error) {
      throw error;
    }
  }

  async findByName(name) {
    try {
      const room = await RoomModel.findOne({ name });
      return room ? Room.fromJSON(room.toObject()) : null;
    } catch (error) {
      throw error;
    }
  }

  async update(id, room) {
    try {
      const roomData = room.toJSON();
      const updatedRoom = await RoomModel.findByIdAndUpdate(
        id,
        { ...roomData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      
      if (!updatedRoom) {
        throw new Error('Sala não encontrada');
      }
      
      return Room.fromJSON(updatedRoom.toObject());
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const result = await RoomModel.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Sala não encontrada');
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async findAll(limit = 10, offset = 0) {
    try {
      const rooms = await RoomModel.find()
        .limit(limit)
        .skip(offset)
        .sort({ createdAt: -1 });
      
      return rooms.map(room => Room.fromJSON(room.toObject()));
    } catch (error) {
      throw error;
    }
  }

  async findActiveRooms() {
    try {
      const rooms = await RoomModel.find({ isActive: true })
        .sort({ createdAt: -1 });
      
      return rooms.map(room => Room.fromJSON(room.toObject()));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RoomRepository;
