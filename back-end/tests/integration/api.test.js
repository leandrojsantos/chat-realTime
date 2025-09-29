/**
 * Testes de integração para a API completa
 * Testa o fluxo completo de requisições HTTP
 */

const request = require('supertest');
const App = require('../../src/app');

describe('Integração da API', () => {
  let app;
  let server;

  beforeAll(async () => {
    app = new App();
    server = app.server;
    
    // Aguardar inicialização
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  describe('Fluxo completo de usuários', () => {
    test('deve criar, listar e buscar usuário', async () => {
      // 1. Criar usuário
      const userData = {
        name: 'Maria Santos',
        email: 'maria@example.com',
        dateOfBirth: '1985-05-15'
      };

      const createResponse = await request(app.app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(createResponse.body.message).toBe('Usuário criado com sucesso');

      // 2. Listar usuários
      const listResponse = await request(app.app)
        .get('/api/users')
        .expect(200);

      expect(Array.isArray(listResponse.body)).toBe(true);
      expect(listResponse.body.length).toBeGreaterThan(0);

      // 3. Buscar usuário específico
      const getResponse = await request(app.app)
        .get('/api/users/1')
        .expect(200);

      expect(getResponse.body).toHaveProperty('id', '1');
      expect(getResponse.body).toHaveProperty('name');
    });
  });

  describe('Fluxo completo de salas', () => {
    test('deve listar salas disponíveis', async () => {
      const response = await request(app.app)
        .get('/api/rooms')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
    });
  });

  describe('Fluxo completo de chat', () => {
    test('deve enviar e listar mensagens', async () => {
      // 1. Enviar mensagem
      const messageData = {
        message: 'Mensagem de teste',
        author: 'Teste',
        room: 'general'
      };

      const sendResponse = await request(app.app)
        .post('/api/chat/messages')
        .send(messageData)
        .expect(201);

      expect(sendResponse.body.message).toBe('Mensagem enviada com sucesso');

      // 2. Listar mensagens
      const listResponse = await request(app.app)
        .get('/api/chat/messages/general')
        .expect(200);

      expect(Array.isArray(listResponse.body)).toBe(true);
    });
  });

  describe('Health check e status', () => {
    test('deve verificar saúde da aplicação', async () => {
      const response = await request(app.app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.uptime).toBeGreaterThan(0);
      expect(response.body.memory).toBeDefined();
    });

    test('deve retornar informações da API', async () => {
      const response = await request(app.app)
        .get('/')
        .expect(200);

      expect(response.body.message).toBe('Chat API v2.0.0');
      expect(response.body.health).toBe('/health');
      expect(response.body.documentation).toBe('/api-docs');
    });
  });

  describe('Middleware de segurança', () => {
    test('deve aplicar headers de segurança', async () => {
      const response = await request(app.app)
        .get('/')
        .expect(200);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    });

    test('deve aplicar CORS corretamente', async () => {
      const response = await request(app.app)
        .get('/')
        .set('Origin', 'http://localhost:3000')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });
  });
});
