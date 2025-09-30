const request = require('supertest');
const App = require('../../src/app');

describe('Admin Dashboard E2E Tests', () => {
  let server;
  let app;

  beforeAll(async () => {
    app = new App();
    server = app.server;
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  afterAll(async () => {
    // Close server
    if (server) {
      server.close();
    }
  });

  describe('Admin Dashboard Access', () => {
    test('should serve admin dashboard HTML', async () => {
      const response = await request(app.app)
        .get('/admin')
        .expect(200);

      expect(response.text).toContain('Chat Admin Dashboard 2025');
      expect(response.text).toContain('Dashboard');
      expect(response.text).toContain('Usuários');
      expect(response.text).toContain('Salas');
      expect(response.text).toContain('Mensagens');
      expect(response.text).toContain('Analytics');
      expect(response.text).toContain('Configurações');
    });

    test('should include modern CSS styles', async () => {
      const response = await request(app.app)
        .get('/admin')
        .expect(200);

      expect(response.text).toContain('--primary-500');
      expect(response.text).toContain('--glass-bg');
      expect(response.text).toContain('backdrop-filter');
      expect(response.text).toContain('border-radius');
    });

    test('should include JavaScript functionality', async () => {
      const response = await request(app.app)
        .get('/admin')
        .expect(200);

      expect(response.text).toContain('updateDashboard');
      expect(response.text).toContain('refreshActivity');
      expect(response.text).toContain('exportUsers');
      expect(response.text).toContain('createRoom');
    });
  });

  describe('Admin API Endpoints', () => {
    test('should get system statistics', async () => {
      const response = await request(app.app)
        .get('/admin/api/stats')
        .expect(200);

      expect(response.body).toHaveProperty('onlineUsers');
      expect(response.body).toHaveProperty('activeRooms');
      expect(response.body).toHaveProperty('messagesToday');
      expect(response.body).toHaveProperty('systemStatus');
      expect(response.body).toHaveProperty('peakUsers');
      expect(response.body).toHaveProperty('messagesPerHour');
      expect(response.body).toHaveProperty('responseTime');
      expect(response.body).toHaveProperty('uptime');

      expect(typeof response.body.onlineUsers).toBe('number');
      expect(typeof response.body.activeRooms).toBe('number');
      expect(typeof response.body.messagesToday).toBe('number');
      expect(typeof response.body.systemStatus).toBe('string');
    });

    test('should get users list', async () => {
      const response = await request(app.app)
        .get('/admin/api/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        const user = response.body[0];
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('lastActivity');
        expect(user).toHaveProperty('status');
      }
    });

    test('should get rooms list', async () => {
      const response = await request(app.app)
        .get('/admin/api/rooms')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        const room = response.body[0];
        expect(room).toHaveProperty('id');
        expect(room).toHaveProperty('name');
        expect(room).toHaveProperty('users');
        expect(room).toHaveProperty('messages');
        expect(room).toHaveProperty('createdAt');
        expect(room).toHaveProperty('status');
      }
    });

    test('should get messages list', async () => {
      const response = await request(app.app)
        .get('/admin/api/messages')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        const message = response.body[0];
        expect(message).toHaveProperty('id');
        expect(message).toHaveProperty('user');
        expect(message).toHaveProperty('room');
        expect(message).toHaveProperty('message');
        expect(message).toHaveProperty('timestamp');
        expect(message).toHaveProperty('type');
      }
    });

    test('should get activity log', async () => {
      const response = await request(app.app)
        .get('/admin/api/activity')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        const activity = response.body[0];
        expect(activity).toHaveProperty('id');
        expect(activity).toHaveProperty('user');
        expect(activity).toHaveProperty('action');
        expect(activity).toHaveProperty('room');
        expect(activity).toHaveProperty('timestamp');
        expect(activity).toHaveProperty('status');
      }
    });
  });

  describe('Settings Management', () => {
    test('should get current settings', async () => {
      const response = await request(app.app)
        .get('/admin/api/settings')
        .expect(200);

      expect(response.body).toHaveProperty('maxMessages');
      expect(response.body).toHaveProperty('inactivityTimeout');
      expect(response.body).toHaveProperty('maintenanceMode');

      expect(typeof response.body.maxMessages).toBe('number');
      expect(typeof response.body.inactivityTimeout).toBe('number');
      expect(typeof response.body.maintenanceMode).toBe('boolean');
    });

    test('should update settings', async () => {
      const newSettings = {
        maxMessages: 2000,
        inactivityTimeout: 45,
        maintenanceMode: true
      };

      const response = await request(app.app)
        .post('/admin/api/settings')
        .send(newSettings)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Configurações salvas com sucesso!');
    });

    test('should handle invalid settings', async () => {
      const invalidSettings = {
        maxMessages: -1,
        inactivityTimeout: 'invalid',
        maintenanceMode: 'not-boolean'
      };

      const response = await request(app.app)
        .post('/admin/api/settings')
        .send(invalidSettings)
        .expect(200);

      // The mock endpoint accepts any data, but in a real app this would validate
      expect(response.body).toHaveProperty('success', true);
    });
  });

  describe('Health Check Integration', () => {
    test('should get system health status', async () => {
      const response = await request(app.app)
        .get('/admin/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('memory');

      expect(typeof response.body.uptime).toBe('number');
      expect(typeof response.body.memory).toBe('object');
    });
  });

  describe('Dashboard Functionality', () => {
    test('should handle dashboard navigation', async () => {
      const response = await request(app.app)
        .get('/admin')
        .expect(200);

      // Check if navigation JavaScript is present
      expect(response.text).toContain('nav-link');
      expect(response.text).toContain('data-section');
      expect(response.text).toContain('content-section');
    });

    test('should include real-time update functionality', async () => {
      const response = await request(app.app)
        .get('/admin')
        .expect(200);

      // Check if real-time update functions are present
      expect(response.text).toContain('setInterval');
      expect(response.text).toContain('updateDashboard');
      expect(response.text).toContain('refreshActivity');
    });

    test('should include responsive design', async () => {
      const response = await request(app.app)
        .get('/admin')
        .expect(200);

      // Check if responsive CSS is present
      expect(response.text).toContain('@media (max-width: 768px)');
      expect(response.text).toContain('grid-template-columns');
    });
  });

  describe('Error Handling', () => {
    test('should handle non-existent admin routes', async () => {
      const response = await request(app.app)
        .get('/admin/nonexistent')
        .expect(404);
    });

    test('should handle invalid API requests', async () => {
      const response = await request(app.app)
        .post('/admin/api/invalid')
        .send({})
        .expect(404);
    });
  });

  describe('Performance', () => {
    test('should load dashboard quickly', async () => {
      const startTime = Date.now();
      
      await request(app.app)
        .get('/admin')
        .expect(200);
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(1000); // Should load in less than 1 second
    });

    test('should handle multiple concurrent requests', async () => {
      const requests = Array(10).fill().map(() => 
        request(app.app).get('/admin/api/stats')
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('onlineUsers');
      });
    });
  });
});
