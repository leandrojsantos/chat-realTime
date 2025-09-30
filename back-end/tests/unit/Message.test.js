const Message = require('../../src/domain/entities/Message');

describe('Message Entity', () => {
  let message;

  beforeEach(() => {
    message = new Message({
      content: 'Hello World',
      author: 'John Doe',
      room: 'general',
      type: 'text'
    });
  });

  describe('Constructor', () => {
    test('should create a message with valid data', () => {
      expect(message.content).toBe('Hello World');
      expect(message.author).toBe('John Doe');
      expect(message.room).toBe('general');
      expect(message.type).toBe('text');
      expect(message.id).toBeDefined();
      expect(message.timestamp).toBeDefined();
    });

    test('should generate a unique ID', () => {
      const message2 = new Message({
        content: 'Another message',
        author: 'Jane Doe',
        room: 'general',
        type: 'text'
      });
      
      expect(message.id).not.toBe(message2.id);
    });

    test('should set timestamp to current time', () => {
      const now = new Date();
      const messageTime = new Date(message.timestamp);
      
      expect(messageTime.getTime()).toBeLessThanOrEqual(now.getTime());
      expect(messageTime.getTime()).toBeGreaterThan(now.getTime() - 1000);
    });
  });

  describe('Validation', () => {
    test('should validate required fields', () => {
      expect(() => {
        new Message({});
      }).toThrow('Content is required');

      expect(() => {
        new Message({ content: 'Hello' });
      }).toThrow('Author is required');

      expect(() => {
        new Message({ content: 'Hello', author: 'John' });
      }).toThrow('Room is required');
    });

    test('should validate content length', () => {
      expect(() => {
        new Message({
          content: '',
          author: 'John',
          room: 'general'
        });
      }).toThrow('Content is required');

      expect(() => {
        new Message({
          content: 'a'.repeat(1001),
          author: 'John',
          room: 'general'
        });
      }).toThrow('Content cannot exceed 1000 characters');
    });

    test('should validate author length', () => {
      expect(() => {
        new Message({
          content: 'Hello',
          author: '',
          room: 'general'
        });
      }).toThrow('Author is required');

      expect(() => {
        new Message({
          content: 'Hello',
          author: 'a'.repeat(51),
          room: 'general'
        });
      }).toThrow('Author cannot exceed 50 characters');
    });

    test('should validate room length', () => {
      expect(() => {
        new Message({
          content: 'Hello',
          author: 'John',
          room: ''
        });
      }).toThrow('Room is required');

      expect(() => {
        new Message({
          content: 'Hello',
          author: 'John',
          room: 'a'.repeat(51)
        });
      }).toThrow('Room cannot exceed 50 characters');
    });
  });

  describe('Methods', () => {
    test('should return message as JSON', () => {
      const json = message.toJSON();
      
      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('content', 'Hello World');
      expect(json).toHaveProperty('author', 'John Doe');
      expect(json).toHaveProperty('room', 'general');
      expect(json).toHaveProperty('type', 'text');
      expect(json).toHaveProperty('timestamp');
    });

    test('should update content', () => {
      message.updateContent('Updated message');
      expect(message.content).toBe('Updated message');
    });

    test('should not update content if empty', () => {
      const originalContent = message.content;
      message.updateContent('');
      expect(message.content).toBe(originalContent);
    });

    test('should not update content if too long', () => {
      const originalContent = message.content;
      message.updateContent('a'.repeat(1001));
      expect(message.content).toBe(originalContent);
    });

    test('should mark as deleted', () => {
      message.markAsDeleted();
      expect(message.deleted).toBe(true);
      expect(message.deletedAt).toBeDefined();
    });

    test('should check if message is deleted', () => {
      expect(message.isDeleted()).toBe(false);
      message.markAsDeleted();
      expect(message.isDeleted()).toBe(true);
    });
  });

  describe('Static Methods', () => {
    test('should create message from JSON', () => {
      const json = {
        id: '123',
        content: 'Hello',
        author: 'John',
        room: 'general',
        type: 'text',
        timestamp: new Date().toISOString()
      };

      const messageFromJson = Message.fromJSON(json);
      
      expect(messageFromJson.id).toBe('123');
      expect(messageFromJson.content).toBe('Hello');
      expect(messageFromJson.author).toBe('John');
      expect(messageFromJson.room).toBe('general');
      expect(messageFromJson.type).toBe('text');
    });

    test('should validate message type', () => {
      expect(Message.isValidType('text')).toBe(true);
      expect(Message.isValidType('image')).toBe(true);
      expect(Message.isValidType('file')).toBe(true);
      expect(Message.isValidType('invalid')).toBe(false);
    });
  });
});
