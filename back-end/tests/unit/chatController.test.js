const request = require('supertest');
const express = require('express');
const chatController = require('../../src/presentation/controllers/chatController');

// Mock dependencies
jest.mock('../../src/application/services/chatService');
jest.mock('../../src/application/services/roomService');
jest.mock('../../src/application/services/userService');

const chatService = require('../../src/application/services/chatService');
const roomService = require('../../src/application/services/roomService');
const userService = require('../../src/application/services/userService');

describe('Chat Controller', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('POST /api/chat/messages', () => {
    test('should create a new message successfully', async () => {
      const messageData = {
        content: 'Hello World',
        author: 'John Doe',
        room: 'general',
        type: 'text'
      };

      const expectedMessage = {
        id: '123',
        ...messageData,
        timestamp: new Date().toISOString()
      };

      chatService.createMessage.mockResolvedValue(expectedMessage);

      app.post('/api/chat/messages', chatController.createMessage);

      const response = await request(app)
        .post('/api/chat/messages')
        .send(messageData)
        .expect(201);

      expect(response.body).toEqual(expectedMessage);
      expect(chatService.createMessage).toHaveBeenCalledWith(messageData);
    });

    test('should return 400 for invalid message data', async () => {
      const invalidData = {
        content: '',
        author: 'John Doe',
        room: 'general'
      };

      chatService.createMessage.mockRejectedValue(new Error('Invalid message data'));

      app.post('/api/chat/messages', chatController.createMessage);

      const response = await request(app)
        .post('/api/chat/messages')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should return 500 for server errors', async () => {
      const messageData = {
        content: 'Hello World',
        author: 'John Doe',
        room: 'general',
        type: 'text'
      };

      chatService.createMessage.mockRejectedValue(new Error('Database error'));

      app.post('/api/chat/messages', chatController.createMessage);

      const response = await request(app)
        .post('/api/chat/messages')
        .send(messageData)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/chat/messages/:roomId', () => {
    test('should get messages for a room', async () => {
      const roomId = 'general';
      const expectedMessages = [
        {
          id: '1',
          content: 'Hello',
          author: 'John',
          room: roomId,
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          content: 'Hi there',
          author: 'Jane',
          room: roomId,
          timestamp: new Date().toISOString()
        }
      ];

      chatService.getMessagesByRoom.mockResolvedValue(expectedMessages);

      app.get('/api/chat/messages/:roomId', chatController.getMessagesByRoom);

      const response = await request(app)
        .get(`/api/chat/messages/${roomId}`)
        .expect(200);

      expect(response.body).toEqual(expectedMessages);
      expect(chatService.getMessagesByRoom).toHaveBeenCalledWith(roomId);
    });

    test('should return 404 for non-existent room', async () => {
      const roomId = 'nonexistent';
      
      chatService.getMessagesByRoom.mockRejectedValue(new Error('Room not found'));

      app.get('/api/chat/messages/:roomId', chatController.getMessagesByRoom);

      const response = await request(app)
        .get(`/api/chat/messages/${roomId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/chat/rooms', () => {
    test('should get all rooms', async () => {
      const expectedRooms = [
        {
          id: '1',
          name: 'General',
          description: 'General discussion',
          type: 'public',
          userCount: 5
        },
        {
          id: '2',
          name: 'Support',
          description: 'Customer support',
          type: 'public',
          userCount: 3
        }
      ];

      roomService.getAllRooms.mockResolvedValue(expectedRooms);

      app.get('/api/chat/rooms', chatController.getAllRooms);

      const response = await request(app)
        .get('/api/chat/rooms')
        .expect(200);

      expect(response.body).toEqual(expectedRooms);
      expect(roomService.getAllRooms).toHaveBeenCalled();
    });

    test('should handle empty rooms list', async () => {
      roomService.getAllRooms.mockResolvedValue([]);

      app.get('/api/chat/rooms', chatController.getAllRooms);

      const response = await request(app)
        .get('/api/chat/rooms')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/chat/rooms', () => {
    test('should create a new room', async () => {
      const roomData = {
        name: 'New Room',
        description: 'A new room for discussion',
        type: 'public'
      };

      const expectedRoom = {
        id: '123',
        ...roomData,
        createdAt: new Date().toISOString(),
        users: [],
        messages: []
      };

      roomService.createRoom.mockResolvedValue(expectedRoom);

      app.post('/api/chat/rooms', chatController.createRoom);

      const response = await request(app)
        .post('/api/chat/rooms')
        .send(roomData)
        .expect(201);

      expect(response.body).toEqual(expectedRoom);
      expect(roomService.createRoom).toHaveBeenCalledWith(roomData);
    });

    test('should return 400 for invalid room data', async () => {
      const invalidData = {
        name: '',
        description: 'Invalid room',
        type: 'public'
      };

      roomService.createRoom.mockRejectedValue(new Error('Invalid room data'));

      app.post('/api/chat/rooms', chatController.createRoom);

      const response = await request(app)
        .post('/api/chat/rooms')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/chat/users', () => {
    test('should get all users', async () => {
      const expectedUsers = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          status: 'online',
          lastActivity: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          status: 'offline',
          lastActivity: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      userService.getAllUsers.mockResolvedValue(expectedUsers);

      app.get('/api/chat/users', chatController.getAllUsers);

      const response = await request(app)
        .get('/api/chat/users')
        .expect(200);

      expect(response.body).toEqual(expectedUsers);
      expect(userService.getAllUsers).toHaveBeenCalled();
    });

    test('should handle empty users list', async () => {
      userService.getAllUsers.mockResolvedValue([]);

      app.get('/api/chat/users', chatController.getAllUsers);

      const response = await request(app)
        .get('/api/chat/users')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/chat/stats', () => {
    test('should get chat statistics', async () => {
      const expectedStats = {
        totalUsers: 25,
        onlineUsers: 8,
        totalRooms: 5,
        activeRooms: 3,
        totalMessages: 1250,
        messagesToday: 45
      };

      chatService.getStats.mockResolvedValue(expectedStats);

      app.get('/api/chat/stats', chatController.getStats);

      const response = await request(app)
        .get('/api/chat/stats')
        .expect(200);

      expect(response.body).toEqual(expectedStats);
      expect(chatService.getStats).toHaveBeenCalled();
    });

    test('should handle stats calculation errors', async () => {
      chatService.getStats.mockRejectedValue(new Error('Stats calculation failed'));

      app.get('/api/chat/stats', chatController.getStats);

      const response = await request(app)
        .get('/api/chat/stats')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });
});
