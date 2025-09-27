const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

describe('E2E Chat Flow Tests', () => {
  let userId;
  let roomId;
  let authToken;

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
  });

  describe('Complete Chat Flow', () => {
    it('should complete full chat workflow', async () => {
      // 1. Criar usuário
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        dateOfBirth: '1990-01-01',
      };

      const userResponse = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      userId = userResponse.body.id;

      // 2. Criar sala
      const roomData = {
        name: 'general',
        description: 'Sala geral para conversas',
        maxUsers: 50,
      };

      const roomResponse = await request(app)
        .post('/api/rooms')
        .send(roomData)
        .expect(201);

      roomId = roomResponse.body.id;

      // 3. Verificar se sala foi criada corretamente
      const getRoomResponse = await request(app)
        .get(`/api/rooms/${roomId}`)
        .expect(200);

      expect(getRoomResponse.body.name).toBe(roomData.name);
      expect(getRoomResponse.body.isActive).toBe(true);

      // 4. Enviar mensagens
      const messages = [
        { content: 'Olá pessoal!', userId, roomId },
        { content: 'Como vocês estão?', userId, roomId },
        { content: 'Alguém online?', userId, roomId },
      ];

      const messageIds = [];
      for (const message of messages) {
        const messageResponse = await request(app)
          .post('/api/chat/messages')
          .send(message)
          .expect(201);

        messageIds.push(messageResponse.body.id);
      }

      // 5. Buscar mensagens da sala
      const messagesResponse = await request(app)
        .get(`/api/chat/messages/${roomId}`)
        .expect(200);

      expect(messagesResponse.body).toHaveLength(3);
      expect(messagesResponse.body[0].content).toBe('Olá pessoal!');

      // 6. Editar uma mensagem
      const editResponse = await request(app)
        .put(`/api/chat/messages/${messageIds[0]}`)
        .send({ content: 'Olá pessoal! Editado' })
        .expect(200);

      expect(editResponse.body.content).toBe('Olá pessoal! Editado');
      expect(editResponse.body.isEdited).toBe(true);

      // 7. Buscar mensagens recentes
      const recentResponse = await request(app)
        .get(`/api/chat/recent/${roomId}?limit=2`)
        .expect(200);

      expect(recentResponse.body).toHaveLength(2);

      // 8. Deletar uma mensagem
      const deleteResponse = await request(app)
        .delete(`/api/chat/messages/${messageIds[2]}`)
        .expect(200);

      expect(deleteResponse.body.message).toContain('deletada com sucesso');

      // 9. Verificar que mensagem foi deletada
      const finalMessagesResponse = await request(app)
        .get(`/api/chat/messages/${roomId}`)
        .expect(200);

      expect(finalMessagesResponse.body).toHaveLength(2);

      // 10. Atualizar sala
      const updateRoomResponse = await request(app)
        .put(`/api/rooms/${roomId}`)
        .send({ description: 'Sala geral atualizada', maxUsers: 100 })
        .expect(200);

      expect(updateRoomResponse.body.description).toBe('Sala geral atualizada');
      expect(updateRoomResponse.body.maxUsers).toBe(100);

      // 11. Listar salas ativas
      const activeRoomsResponse = await request(app)
        .get('/api/rooms/active')
        .expect(200);

      expect(activeRoomsResponse.body).toHaveLength(1);
      expect(activeRoomsResponse.body[0].id).toBe(roomId);

      // 12. Deletar sala
      const deleteRoomResponse = await request(app)
        .delete(`/api/rooms/${roomId}`)
        .expect(200);

      expect(deleteRoomResponse.body.message).toContain('deletada com sucesso');

      // 13. Verificar que sala foi deletada
      await request(app)
        .get(`/api/rooms/${roomId}`)
        .expect(404);

      // 14. Deletar usuário
      const deleteUserResponse = await request(app)
        .delete(`/api/users/${userId}`)
        .expect(200);

      expect(deleteUserResponse.body.message).toContain('deletado com sucesso');

      // 15. Verificar que usuário foi deletado
      await request(app)
        .get(`/api/users/${userId}`)
        .expect(404);
    });
  });

  describe('Error Handling Flow', () => {
    it('should handle errors gracefully throughout the flow', async () => {
      // Tentar criar usuário com dados inválidos
      await request(app)
        .post('/api/users')
        .send({ name: 'J', email: 'invalid-email' })
        .expect(400);

      // Tentar criar sala com dados inválidos
      await request(app)
        .post('/api/rooms')
        .send({ name: 'A', description: 'Sala' })
        .expect(400);

      // Tentar buscar usuário inexistente
      await request(app)
        .get('/api/users/non-existent-id')
        .expect(404);

      // Tentar buscar sala inexistente
      await request(app)
        .get('/api/rooms/non-existent-id')
        .expect(404);

      // Tentar enviar mensagem sem dados obrigatórios
      await request(app)
        .post('/api/chat/messages')
        .send({})
        .expect(400);

      // Tentar editar mensagem inexistente
      await request(app)
        .put('/api/chat/messages/non-existent-id')
        .send({ content: 'Nova mensagem' })
        .expect(404);

      // Tentar deletar mensagem inexistente
      await request(app)
        .delete('/api/chat/messages/non-existent-id')
        .expect(404);
    });
  });

  describe('Performance Tests', () => {
    it('should handle multiple concurrent operations', async () => {
      // Criar múltiplos usuários simultaneamente
      const userPromises = [];
      for (let i = 0; i < 5; i++) {
        userPromises.push(
          request(app)
            .post('/api/users')
            .send({
              name: `Usuário ${i}`,
              email: `user${i}@example.com`,
              dateOfBirth: '1990-01-01',
            })
        );
      }

      const userResponses = await Promise.all(userPromises);
      expect(userResponses).toHaveLength(5);

      // Criar múltiplas salas simultaneamente
      const roomPromises = [];
      for (let i = 0; i < 3; i++) {
        roomPromises.push(
          request(app)
            .post('/api/rooms')
            .send({
              name: `sala-${i}`,
              description: `Sala ${i} para conversas`,
            })
        );
      }

      const roomResponses = await Promise.all(roomPromises);
      expect(roomResponses).toHaveLength(3);

      // Enviar múltiplas mensagens simultaneamente
      const messagePromises = [];
      for (let i = 0; i < 10; i++) {
        messagePromises.push(
          request(app)
            .post('/api/chat/messages')
            .send({
              content: `Mensagem ${i}`,
              userId: userResponses[0].body.id,
              roomId: roomResponses[0].body.id,
            })
        );
      }

      const messageResponses = await Promise.all(messagePromises);
      expect(messageResponses).toHaveLength(10);
    });
  });
});
