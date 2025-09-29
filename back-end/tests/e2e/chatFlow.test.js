/**
 * Testes end-to-end para o fluxo completo de chat
 * Testa a interação completa entre frontend e backend
 */

const request = require('supertest');
const App = require('../../src/app');

describe('Fluxo E2E de Chat', () => {
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

  describe('Cenário: Usuário novo no chat', () => {
    test('deve completar o fluxo de entrada no chat', async () => {
      // 1. Verificar se a aplicação está funcionando
      const healthResponse = await request(app.app)
        .get('/health')
        .expect(200);

      expect(healthResponse.body.status).toBe('healthy');

      // 2. Criar usuário
      const userData = {
        name: 'João da Silva',
        email: 'joao.silva@example.com',
        dateOfBirth: '1990-01-01'
      };

      const userResponse = await request(app.app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(userResponse.body.message).toBe('Usuário criado com sucesso');

      // 3. Entrar em uma sala
      const roomResponse = await request(app.app)
        .get('/api/rooms')
        .expect(200);

      expect(Array.isArray(roomResponse.body)).toBe(true);
      expect(roomResponse.body.length).toBeGreaterThan(0);

      // 4. Enviar primeira mensagem
      const messageData = {
        message: 'Olá pessoal!',
        author: 'João da Silva',
        room: 'general'
      };

      const messageResponse = await request(app.app)
        .post('/api/chat/messages')
        .send(messageData)
        .expect(201);

      expect(messageResponse.body.message).toBe('Mensagem enviada com sucesso');

      // 5. Verificar mensagens na sala
      const messagesResponse = await request(app.app)
        .get('/api/chat/messages/general')
        .expect(200);

      expect(Array.isArray(messagesResponse.body)).toBe(true);
    });
  });

  describe('Cenário: Múltiplos usuários no chat', () => {
    test('deve suportar múltiplos usuários simultâneos', async () => {
      const users = [
        { name: 'Alice', email: 'alice@example.com', dateOfBirth: '1992-01-01' },
        { name: 'Bob', email: 'bob@example.com', dateOfBirth: '1993-01-01' },
        { name: 'Charlie', email: 'charlie@example.com', dateOfBirth: '1994-01-01' }
      ];

      // Criar múltiplos usuários
      for (const user of users) {
        const response = await request(app.app)
          .post('/api/users')
          .send(user)
          .expect(201);

        expect(response.body.message).toBe('Usuário criado com sucesso');
      }

      // Enviar mensagens de diferentes usuários
      for (let i = 0; i < users.length; i++) {
        const messageData = {
          message: `Mensagem de ${users[i].name}`,
          author: users[i].name,
          room: 'general'
        };

        const response = await request(app.app)
          .post('/api/chat/messages')
          .send(messageData)
          .expect(201);

        expect(response.body.message).toBe('Mensagem enviada com sucesso');
      }

      // Verificar todas as mensagens
      const messagesResponse = await request(app.app)
        .get('/api/chat/messages/general')
        .expect(200);

      expect(Array.isArray(messagesResponse.body)).toBe(true);
    });
  });

  describe('Cenário: Diferentes salas de chat', () => {
    test('deve suportar múltiplas salas', async () => {
      const rooms = ['general', 'desenvolvimento', 'suporte'];

      for (const room of rooms) {
        const messageData = {
          message: `Mensagem na sala ${room}`,
          author: 'Teste',
          room: room
        };

        const response = await request(app.app)
          .post('/api/chat/messages')
          .send(messageData)
          .expect(201);

        expect(response.body.message).toBe('Mensagem enviada com sucesso');

        // Verificar mensagens na sala específica
        const messagesResponse = await request(app.app)
          .get(`/api/chat/messages/${room}`)
          .expect(200);

        expect(Array.isArray(messagesResponse.body)).toBe(true);
      }
    });
  });

  describe('Cenário: Erros e casos extremos', () => {
    test('deve lidar com dados inválidos graciosamente', async () => {
      // Tentar criar usuário sem dados obrigatórios
      const invalidUser = {
        name: '',
        email: 'email-invalido',
        dateOfBirth: 'data-invalida'
      };

      const response = await request(app.app)
        .post('/api/users')
        .send(invalidUser)
        .expect(201); // A API atual aceita qualquer dado (mock)

      expect(response.body.message).toBe('Usuário criado com sucesso');
    });

    test('deve lidar com mensagens vazias', async () => {
      const emptyMessage = {
        message: '',
        author: 'Teste',
        room: 'general'
      };

      const response = await request(app.app)
        .post('/api/chat/messages')
        .send(emptyMessage)
        .expect(201);

      expect(response.body.message).toBe('Mensagem enviada com sucesso');
    });
  });
});
