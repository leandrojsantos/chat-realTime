/**
 * Testes end-to-end para o fluxo completo de chat
 * Testa a interação completa entre frontend e backend
 */

const request = require('supertest');
const io = require('socket.io-client');
const App = require('../../src/app');

describe('Chat Flow E2E Tests', () => {
  let app;
  let server;
  let clientSocket;
  let clientSocket2;
  let baseUrl;

  beforeAll(async () => {
    app = new App();
    server = app.server;
    await new Promise(resolve => {
      const s = server.listen(0, () => {
        const { port } = s.address();
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  beforeEach(() => {
    clientSocket = io(baseUrl, { transports: ['websocket'] });
    clientSocket2 = io(baseUrl, { transports: ['websocket'] });
  });

  afterEach(() => {
    // Disconnect sockets
    if (clientSocket) {
      clientSocket.disconnect();
    }
    if (clientSocket2) {
      clientSocket2.disconnect();
    }
  });

  describe('Health Check', () => {
    test('should return health status', async () => {
      const response = await request(app.app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('API Endpoints', () => {
    test('should get root endpoint', async () => {
      const response = await request(app.app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Chat API v2.0.0');
      expect(response.body).toHaveProperty('health', '/health');
      expect(response.body).toHaveProperty('documentation', '/api-docs');
      expect(response.body).toHaveProperty('admin', '/admin');
    });

    test('should get admin dashboard', async () => {
      const response = await request(app.app)
        .get('/admin')
        .expect(200);

      expect(response.text).toContain('Chat Admin Dashboard 2025');
    });

    test('should get admin API stats', async () => {
      const response = await request(app.app)
        .get('/admin/api/stats')
        .expect(200);

      expect(response.body).toHaveProperty('onlineUsers');
      expect(response.body).toHaveProperty('activeRooms');
      expect(response.body).toHaveProperty('messagesToday');
      expect(response.body).toHaveProperty('systemStatus');
    });
  });

  describe('Socket Connection', () => {
    test('should connect to socket server', (done) => {
      clientSocket.on('connect', () => {
        expect(clientSocket.connected).toBe(true);
        done();
      });

      clientSocket.on('connect_error', (error) => {
        done(error);
      });
    });

    test('should disconnect from socket server', (done) => {
      clientSocket.on('connect', () => {
        clientSocket.disconnect();
        
        setTimeout(() => {
          expect(clientSocket.connected).toBe(false);
          done();
        }, 100);
      });
    });
  });

  describe('Room Management', () => {
    test('should join a room', (done) => {
      const roomName = 'test-room';
      const username = 'test-user';

      clientSocket.on('connect', () => {
        clientSocket.emit('join_room', roomName);
        
        // Listen for room join confirmation
        clientSocket.on('room_joined', (data) => {
          expect(data.room).toBe(roomName);
          expect(data.username).toBe(username);
          done();
        });
      });
    });

    test('should handle multiple users in same room', (done) => {
      const roomName = 'multi-user-room';
      const user1 = 'user1';
      const user2 = 'user2';

      let connectedUsers = 0;

      const handleUserJoined = (data) => {
        connectedUsers++;
        if (connectedUsers === 2) {
          expect(data.room).toBe(roomName);
          done();
        }
      };

      clientSocket.on('connect', () => {
        clientSocket.emit('join_room', roomName);
        clientSocket.on('user_joined', handleUserJoined);
      });

      clientSocket2.on('connect', () => {
        clientSocket2.emit('join_room', roomName);
        clientSocket2.on('user_joined', handleUserJoined);
      });
    });
  });

  describe('Message Flow', () => {
    test('should send and receive messages', (done) => {
      const roomName = 'message-test-room';
      const messageData = {
        room: roomName,
        author: 'test-user',
        message: 'Hello World!',
        time: new Date().toLocaleTimeString()
      };

      clientSocket.on('connect', () => {
        clientSocket.emit('join_room', roomName);
        
        clientSocket.on('room_joined', () => {
          clientSocket.emit('send_message', messageData);
        });

        clientSocket.on('receive_message', (data) => {
          expect(data.message).toBe(messageData.message);
          expect(data.author).toBe(messageData.author);
          expect(data.room).toBe(messageData.room);
          done();
        });
      });
    });

    test('should broadcast messages to all users in room', (done) => {
      const roomName = 'broadcast-test-room';
      const messageData = {
        room: roomName,
        author: 'sender',
        message: 'Broadcast message',
        time: new Date().toLocaleTimeString()
      };

      let messagesReceived = 0;

      const handleMessage = (data) => {
        messagesReceived++;
        expect(data.message).toBe(messageData.message);
        
        if (messagesReceived === 2) {
          done();
        }
      };

      clientSocket.on('connect', () => {
        clientSocket.emit('join_room', roomName);
        clientSocket.on('receive_message', handleMessage);
      });

      clientSocket2.on('connect', () => {
        clientSocket2.emit('join_room', roomName);
        clientSocket2.on('receive_message', handleMessage);
        
        // Send message after both users are connected
        setTimeout(() => {
          clientSocket.emit('send_message', messageData);
        }, 100);
      });
    });
  });

  describe('User Management', () => {
    test('should handle user typing indicators', (done) => {
      const roomName = 'typing-test-room';
      const username = 'typing-user';

      clientSocket.on('connect', () => {
        clientSocket.emit('join_room', roomName);
        
        clientSocket.on('room_joined', () => {
          clientSocket.emit('typing', { room: roomName, username });
        });

        clientSocket.on('user_typing', (data) => {
          expect(data.username).toBe(username);
          expect(data.room).toBe(roomName);
          done();
        });
      });
    });

    test('should handle user stop typing', (done) => {
      const roomName = 'stop-typing-test-room';
      const username = 'stop-typing-user';

      clientSocket.on('connect', () => {
        clientSocket.emit('join_room', roomName);
        
        clientSocket.on('room_joined', () => {
          clientSocket.emit('typing', { room: roomName, username });
          
          setTimeout(() => {
            clientSocket.emit('stop_typing', { room: roomName, username });
          }, 100);
        });

        clientSocket.on('user_stop_typing', (data) => {
          expect(data.username).toBe(username);
          expect(data.room).toBe(roomName);
          done();
        });
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid room names', (done) => {
      const invalidRoom = '';

      clientSocket.on('connect', () => {
        clientSocket.emit('join_room', invalidRoom);
        
        clientSocket.on('error', (error) => {
          expect(error).toBeDefined();
          done();
        });
      });
    });

    test('should handle invalid message data', (done) => {
      const roomName = 'error-test-room';
      const invalidMessage = {
        room: roomName,
        author: '',
        message: '',
        time: new Date().toLocaleTimeString()
      };

      clientSocket.on('connect', () => {
        clientSocket.emit('join_room', roomName);
        
        clientSocket.on('room_joined', () => {
          clientSocket.emit('send_message', invalidMessage);
        });

        clientSocket.on('error', (error) => {
          expect(error).toBeDefined();
          done();
        });
      });
    });
  });

  describe('Performance Tests', () => {
    test('should handle multiple rapid messages', (done) => {
      const roomName = 'performance-test-room';
      const messageCount = 10;
      let receivedCount = 0;

      clientSocket.on('connect', () => {
        clientSocket.emit('join_room', roomName);
        
        clientSocket.on('receive_message', (data) => {
          receivedCount++;
          if (receivedCount === messageCount) {
            done();
          }
        });

        // Send multiple messages rapidly
        for (let i = 0; i < messageCount; i++) {
          setTimeout(() => {
            clientSocket.emit('send_message', {
              room: roomName,
              author: 'perf-test-user',
              message: `Message ${i + 1}`,
              time: new Date().toLocaleTimeString()
            });
          }, i * 10);
        }
      });
    });

    test('should handle concurrent users', (done) => {
      const roomName = 'concurrent-test-room';
      const userCount = 5;
      let acks = 0;
      let finished = false;

      const sockets = [];

      const maybeFinish = () => {
        if (!finished && acks >= userCount) {
          finished = true;
          sockets.forEach(s => s.disconnect());
          done();
        }
      };

      for (let i = 0; i < userCount; i++) {
        const socket = io(baseUrl, { transports: ['websocket'], auth: { username: 'test-user' } });
        sockets.push(socket);

        socket.on('connect', () => {
          socket.emit('join_room', { room: roomName, username: 'test-user' });
        });

        socket.on('room_joined', (data) => {
          if (data?.room === roomName) {
            acks++;
            maybeFinish();
          }
        });

        socket.on('user_connected', (data) => {
          // Extra signal from backend for fast sync; count only if in this room
          if (data?.room === roomName || data?.id) {
            acks++;
            maybeFinish();
          }
        });
      }
    }, 12000);
  });
});
