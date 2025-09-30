const Room = require('../../domain/entities/Room');

class RoomService {
  constructor() {
    this.rooms = [
      new Room({
        name: 'General',
        description: 'General discussion room',
        type: 'public'
      }),
      new Room({
        name: 'Support',
        description: 'Customer support room',
        type: 'public'
      })
    ];
  }

  async getAllRooms() {
    try {
      return this.rooms.map(room => ({
        id: room.id,
        name: room.name,
        description: room.description,
        type: room.type,
        userCount: room.getUserCount()
      }));
    } catch (error) {
      throw new Error(`Failed to get rooms: ${error.message}`);
    }
  }

  async createRoom(roomData) {
    try {
      const room = new Room(roomData);
      this.rooms.push(room);
      return room;
    } catch (error) {
      throw new Error(`Failed to create room: ${error.message}`);
    }
  }

  async getRoomById(roomId) {
    try {
      const room = this.rooms.find(r => r.id === roomId);
      if (!room) {
        throw new Error('Room not found');
      }
      return room;
    } catch (error) {
      throw new Error(`Failed to get room: ${error.message}`);
    }
  }

  async updateRoom(roomId, updateData) {
    try {
      const roomIndex = this.rooms.findIndex(r => r.id === roomId);
      if (roomIndex === -1) {
        throw new Error('Room not found');
      }
      
      const room = this.rooms[roomIndex];
      if (updateData.name) room.updateName(updateData.name);
      if (updateData.description) room.updateDescription(updateData.description);
      if (updateData.type) {
        if (updateData.type === 'private') room.setPrivate();
        if (updateData.type === 'public') room.setPublic();
      }
      
      return room;
    } catch (error) {
      throw new Error(`Failed to update room: ${error.message}`);
    }
  }

  async deleteRoom(roomId) {
    try {
      const roomIndex = this.rooms.findIndex(r => r.id === roomId);
      if (roomIndex === -1) {
        throw new Error('Room not found');
      }
      
      const deletedRoom = this.rooms.splice(roomIndex, 1)[0];
      return deletedRoom;
    } catch (error) {
      throw new Error(`Failed to delete room: ${error.message}`);
    }
  }

  async addUserToRoom(roomId, user) {
    try {
      const room = await this.getRoomById(roomId);
      room.addUser(user);
      return room;
    } catch (error) {
      throw new Error(`Failed to add user to room: ${error.message}`);
    }
  }

  async removeUserFromRoom(roomId, userId) {
    try {
      const room = await this.getRoomById(roomId);
      room.removeUser(userId);
      return room;
    } catch (error) {
      throw new Error(`Failed to remove user from room: ${error.message}`);
    }
  }
}

module.exports = new RoomService();

