const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

describe('Room API Tests', () => {
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

  describe('POST /api/rooms', () => {
    it('should create a new room', async () => {
      const roomData = {
        name: 'general',
        description: 'Sala geral para conversas',
        maxUsers: 50,
      };

      const response = await request(app)
        .post('/api/rooms')
        .send(roomData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(roomData.name);
      expect(response.body.description).toBe(roomData.description);
      expect(response.body.isActive).toBe(true);
    });

    it('should not create room with duplicate name', async () => {
      const roomData = {
        name: 'general',
        description: 'Sala geral para conversas',
      };

      // Criar primeira sala
      await request(app)
        .post('/api/rooms')
        .send(roomData)
        .expect(201);

      // Tentar criar segunda sala com mesmo nome
      const response = await request(app)
        .post('/api/rooms')
        .send(roomData)
        .expect(400);

      expect(response.body.error).toContain('Nome da sala já está em uso');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/rooms')
        .send({})
        .expect(400);

      expect(response.body.error).toContain('obrigatórios');
    });
  });

  describe('GET /api/rooms', () => {
    it('should list rooms', async () => {
      // Criar algumas salas
      const rooms = [
        {
          name: 'general',
          description: 'Sala geral',
        },
        {
          name: 'tech',
          description: 'Discussões sobre tecnologia',
        },
      ];

      for (const room of rooms) {
        await request(app)
          .post('/api/rooms')
          .send(room);
      }

      const response = await request(app)
        .get('/api/rooms')
        .expect(200);

      expect(response.body).toHaveLength(2);
    });

    it('should list active rooms only', async () => {
      // Criar sala ativa
      await request(app)
        .post('/api/rooms')
        .send({
          name: 'active-room',
          description: 'Sala ativa',
        });

      // Criar sala inativa
      const inactiveRoom = await request(app)
        .post('/api/rooms')
        .send({
          name: 'inactive-room',
          description: 'Sala inativa',
        });

      // Desativar sala
      await request(app)
        .put(`/api/rooms/${inactiveRoom.body.id}`)
        .send({ isActive: false });

      const response = await request(app)
        .get('/api/rooms/active')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('active-room');
    });
  });

  describe('PUT /api/rooms/:id', () => {
    it('should update room', async () => {
      // Criar sala
      const roomData = {
        name: 'general',
        description: 'Sala geral para conversas',
      };

      const createResponse = await request(app)
        .post('/api/rooms')
        .send(roomData);

      const roomId = createResponse.body.id;

      // Atualizar sala
      const updateData = {
        description: 'Sala geral atualizada',
        maxUsers: 100,
      };

      const response = await request(app)
        .put(`/api/rooms/${roomId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.description).toBe(updateData.description);
      expect(response.body.maxUsers).toBe(updateData.maxUsers);
    });
  });
});
