// Jest setup file for unit tests

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3002';
process.env.MONGODB_URI = 'mongodb://localhost:27017/chat-test';
process.env.REDIS_URL = 'redis://localhost:6379/1';

// Global test setup
beforeAll(async () => {
  // Setup any global test configuration here
  console.log('Setting up test environment...');
});

afterAll(async () => {
  // Cleanup after all tests
  console.log('Cleaning up test environment...');
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
