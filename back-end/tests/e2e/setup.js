// Jest setup file for e2e tests

// Mock environment variables for e2e tests
process.env.NODE_ENV = 'test';
process.env.PORT = '3003';
process.env.MONGODB_URI = 'mongodb://localhost:27017/chat-e2e-test';
process.env.REDIS_URL = 'redis://localhost:6379/2';

// Global e2e test setup
beforeAll(async () => {
  console.log('Setting up e2e test environment...');
  
  // Wait a bit for the server to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));
});

afterAll(async () => {
  console.log('Cleaning up e2e test environment...');
});

// Mock console methods to reduce noise in e2e tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
