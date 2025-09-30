const chatService = require('../../application/services/chatService');
const roomService = require('../../application/services/roomService');
const userService = require('../../application/services/userService');

class ChatController {
  async createMessage(req, res) {
    try {
      const message = await chatService.createMessage(req.body);
      res.status(201).json(message);
    } catch (error) {
      if (error.message.includes('Database error') || error.message.includes('Failed to create message')) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async getMessagesByRoom(req, res) {
    try {
      const { roomId } = req.params;
      const messages = await chatService.getMessagesByRoom(roomId);
      res.status(200).json(messages);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getAllRooms(req, res) {
    try {
      const rooms = await roomService.getAllRooms();
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createRoom(req, res) {
    try {
      const room = await roomService.createRoom(req.body);
      res.status(201).json(room);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getStats(req, res) {
    try {
      const stats = await chatService.getStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ChatController();
