/**
 * Testes unitários para as rotas de usuários
 * Testa os endpoints de criação, listagem e busca de usuários
 */

const request = require('supertest');
const express = require('express');
const userRoutes = require('../../src/routes/userRoutes');

describe('Rotas de Usuários', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/users', userRoutes);
  });

  describe('POST /api/users', () => {
    test('deve criar um novo usuário com dados válidos', async () => {
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        dateOfBirth: '1990-01-01'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Usuário criado com sucesso');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(userData);
    });

    test('deve aceitar usuário sem validação rigorosa (mock)', async () => {
      const userData = {
        name: 'Teste',
        email: 'teste@teste.com',
        dateOfBirth: '2000-01-01'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('Usuário criado com sucesso');
    });
  });

  describe('GET /api/users', () => {
    test('deve listar todos os usuários', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('email');
      expect(response.body[0]).toHaveProperty('dateOfBirth');
    });

    test('deve aceitar parâmetros de paginação', async () => {
      const response = await request(app)
        .get('/api/users?limit=5&offset=0')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/users/:id', () => {
    test('deve buscar usuário por ID', async () => {
      const userId = '123';
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('name', 'Usuário Teste');
      expect(response.body).toHaveProperty('email', 'teste@example.com');
      expect(response.body).toHaveProperty('dateOfBirth', '1990-01-01');
    });

    test('deve retornar usuário mock para qualquer ID', async () => {
      const response = await request(app)
        .get('/api/users/qualquer-id')
        .expect(200);

      expect(response.body).toHaveProperty('id', 'qualquer-id');
      expect(response.body).toHaveProperty('name');
    });
  });
});
