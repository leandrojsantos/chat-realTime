const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

describe('Chat API Tests', () => {
  let userId;
  let roomId;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/chatdb_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();

    // Criar usuário para os testes
    const userData = {
      name: 'João Silva',
      email: 'joao@example.com',
      dateOfBirth: '1990-01-01',
    };

    const userResponse = await request(app)
      .post('/api/users')
      .send(userData);
    userId = userResponse.body.id;

    // Criar sala para os testes
    const roomData = {
      name: 'general',
      description: 'Sala geral para conversas',
    };

    const roomResponse = await request(app)
      .post('/api/rooms')
      .send(roomData);
    roomId = roomResponse.body.id;
  });

  describe('POST /api/chat/messages', () => {
    it('should send a message', async () => {
      const messageData = {
        content: 'Olá pessoal!',
        userId,
        roomId,
        messageType: 'text',
      };

      const response = await request(app)
        .post('/api/chat/messages')
        .send(messageData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.content).toBe(messageData.content);
      expect(response.body.userId).toBe(userId);
      expect(response.body.roomId).toBe(roomId);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/chat/messages')
        .send({})
        .expect(400);

      expect(response.body.error).toContain('obrigatórios');
    });

    it('should validate message length', async () => {
      const messageData = {
        content: 'a'.repeat(2001), // Muito longo
        userId,
        roomId,
      };

      const response = await request(app)
        .post('/api/chat/messages')
        .send(messageData)
        .expect(400);

      expect(response.body.error).toContain('caracteres');
    });
  });

  describe('GET /api/chat/messages/:roomId', () => {
    it('should get messages from room', async () => {
      // Enviar algumas mensagens
      const messages = [
        { content: 'Primeira mensagem', userId, roomId },
        { content: 'Segunda mensagem', userId, roomId },
        { content: 'Terceira mensagem', userId, roomId },
      ];

      for (const message of messages) {
        await request(app)
          .post('/api/chat/messages')
          .send(message);
      }

      const response = await request(app)
        .get(`/api/chat/messages/${roomId}`)
        .expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body[0].content).toBe('Primeira mensagem');
    });

    it('should respect limit and offset', async () => {
      // Enviar 5 mensagens
      for (let i = 1; i <= 5; i++) {
        await request(app)
          .post('/api/chat/messages')
          .send({
            content: `Mensagem ${i}`,
            userId,
            roomId,
          });
      }

      // Buscar apenas 2 mensagens com offset de 1
      const response = await request(app)
        .get(`/api/chat/messages/${roomId}?limit=2&offset=1`)
        .expect(200);

      expect(response.body).toHaveLength(2);
    });
  });

  describe('PUT /api/chat/messages/:messageId', () => {
    it('should edit message', async () => {
      // Enviar mensagem
      const messageData = {
        content: 'Mensagem original',
        userId,
        roomId,
      };

      const createResponse = await request(app)
        .post('/api/chat/messages')
        .send(messageData);

      const messageId = createResponse.body.id;

      // Editar mensagem
      const response = await request(app)
        .put(`/api/chat/messages/${messageId}`)
        .send({ content: 'Mensagem editada' })
        .expect(200);

      expect(response.body.content).toBe('Mensagem editada');
      expect(response.body.isEdited).toBe(true);
    });

    it('should return 404 for non-existent message', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .put(`/api/chat/messages/${fakeId}`)
        .send({ content: 'Nova mensagem' })
        .expect(404);

      expect(response.body.error).toContain('não encontrada');
    });
  });

  describe('DELETE /api/chat/messages/:messageId', () => {
    it('should delete message', async () => {
      // Enviar mensagem
      const messageData = {
        content: 'Mensagem para deletar',
        userId,
        roomId,
      };

      const createResponse = await request(app)
        .post('/api/chat/messages')
        .send(messageData);

      const messageId = createResponse.body.id;

      // Deletar mensagem
      const response = await request(app)
        .delete(`/api/chat/messages/${messageId}`)
        .expect(200);

      expect(response.body.message).toContain('deletada com sucesso');
    });
  });
});
