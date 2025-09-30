/**
 * Testes unitários para a classe App
 * Testa a inicialização e configuração da aplicação
 */

const request = require('supertest');
const App = require('../../src/app');

describe('Classe App', () => {
  let app;
  let server;

  beforeEach(() => {
    // Criar nova instância da aplicação para cada teste
    app = new App();
    server = app.server;
  });

  afterEach(() => {
    // Fechar servidor após cada teste
    if (server) {
      server.close();
    }
  });

  describe('Inicialização da aplicação', () => {
    test('deve criar uma instância da aplicação', () => {
      expect(app).toBeDefined();
      expect(app.app).toBeDefined();
      expect(app.server).toBeDefined();
      expect(app.port).toBe(process.env.PORT || 3001);
    });

    test('deve configurar middlewares de segurança', async () => {
      const response = await request(app.app)
        .get('/')
        .expect(200);

      // Verificar se os headers de segurança estão presentes
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    });

    test('deve configurar CORS corretamente', async () => {
      const response = await request(app.app)
        .get('/')
        .set('Origin', 'http://localhost:3000')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });
  });

  describe('Rotas da aplicação', () => {
    test('deve responder ao endpoint de health check', async () => {
      const response = await request(app.app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('memory');
    });

    test('deve responder ao endpoint raiz', async () => {
      const response = await request(app.app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Chat API v2.0.0');
      expect(response.body).toHaveProperty('health', '/health');
      expect(response.body).toHaveProperty('documentation', '/api-docs');
      expect(response.body).toHaveProperty('admin', '/admin');
    });

    test('deve redirecionar /docs para /api-docs', async () => {
      const response = await request(app.app)
        .get('/docs')
        .expect(302);

      expect(response.headers.location).toBe('/api-docs');
    });
  });

  describe('Configuração do Swagger', () => {
    test('deve configurar o Swagger UI', async () => {
      const response = await request(app.app)
        .get('/api-docs/')
        .expect(200);

      expect(response.text).toContain('swagger-ui');
    });
  });

  describe('Rate limiting', () => {
    test('deve aplicar rate limiting nas rotas da API', async () => {
      // Fazer múltiplas requisições para testar o rate limiting
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(request(app.app).get('/api/users'));
      }

      const responses = await Promise.all(promises);
      
      // Todas as requisições devem ser bem-sucedidas (dentro do limite)
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });
});
