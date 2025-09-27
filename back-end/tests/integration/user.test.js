const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

describe('User API Tests', () => {
  beforeAll(async () => {
    // Conectar ao banco de teste
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/chatdb_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Limpar e desconectar
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Limpar dados antes de cada teste
    await mongoose.connection.db.dropDatabase();
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        dateOfBirth: '1990-01-01',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
    });

    it('should not create user with duplicate email', async () => {
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        dateOfBirth: '1990-01-01',
      };

      // Criar primeiro usuário
      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      // Tentar criar segundo usuário com mesmo email
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body.error).toContain('Email já está em uso');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({})
        .expect(400);

      expect(response.body.error).toContain('obrigatórios');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by id', async () => {
      // Criar usuário
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        dateOfBirth: '1990-01-01',
      };

      const createResponse = await request(app)
        .post('/api/users')
        .send(userData);

      const userId = createResponse.body.id;

      // Buscar usuário
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.name).toBe(userData.name);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .get(`/api/users/${fakeId}`)
        .expect(404);

      expect(response.body.error).toContain('não encontrado');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user', async () => {
      // Criar usuário
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        dateOfBirth: '1990-01-01',
      };

      const createResponse = await request(app)
        .post('/api/users')
        .send(userData);

      const userId = createResponse.body.id;

      // Atualizar usuário
      const updateData = {
        name: 'João Santos',
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.email).toBe(userData.email);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user', async () => {
      // Criar usuário
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        dateOfBirth: '1990-01-01',
      };

      const createResponse = await request(app)
        .post('/api/users')
        .send(userData);

      const userId = createResponse.body.id;

      // Deletar usuário
      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.message).toContain('deletado com sucesso');
    });
  });
});
