const Message = require('../../src/domain/entities/Message');

describe('Message Entity Tests', () => {
  describe('Constructor', () => {
    it('should create a valid message', () => {
      const messageData = {
        content: 'Olá pessoal!',
        userId: 'user-123',
        roomId: 'room-456',
        messageType: 'text',
      };

      const message = new Message(messageData);

      expect(message.content).toBe(messageData.content);
      expect(message.userId).toBe(messageData.userId);
      expect(message.roomId).toBe(messageData.roomId);
      expect(message.messageType).toBe(messageData.messageType);
      expect(message.isEdited).toBe(false);
      expect(message.id).toBeDefined();
      expect(message.createdAt).toBeDefined();
      expect(message.updatedAt).toBeDefined();
    });

    it('should use default values', () => {
      const messageData = {
        content: 'Olá pessoal!',
        userId: 'user-123',
        roomId: 'room-456',
      };

      const message = new Message(messageData);

      expect(message.messageType).toBe('text');
      expect(message.isEdited).toBe(false);
    });
  });

  describe('Validation', () => {
    it('should throw error for empty content', () => {
      const messageData = {
        content: '',
        userId: 'user-123',
        roomId: 'room-456',
      };

      expect(() => new Message(messageData)).toThrow('Mensagem inválida');
    });

    it('should throw error for content too long', () => {
      const messageData = {
        content: 'A'.repeat(2001),
        userId: 'user-123',
        roomId: 'room-456',
      };

      expect(() => new Message(messageData)).toThrow('Mensagem inválida');
    });

    it('should throw error for invalid message type', () => {
      const messageData = {
        content: 'Olá pessoal!',
        userId: 'user-123',
        roomId: 'room-456',
        messageType: 'invalid',
      };

      expect(() => new Message(messageData)).toThrow('Mensagem inválida');
    });

    it('should accept valid message types', () => {
      const validTypes = ['text', 'image', 'file', 'system'];
      
      validTypes.forEach(type => {
        const messageData = {
          content: 'Test message',
          userId: 'user-123',
          roomId: 'room-456',
          messageType: type,
        };

        expect(() => new Message(messageData)).not.toThrow();
      });
    });
  });

  describe('edit method', () => {
    it('should edit message content', () => {
      const messageData = {
        content: 'Mensagem original',
        userId: 'user-123',
        roomId: 'room-456',
      };

      const message = new Message(messageData);
      const originalUpdatedAt = message.updatedAt;

      setTimeout(() => {
        message.edit('Mensagem editada');
        
        expect(message.content).toBe('Mensagem editada');
        expect(message.isEdited).toBe(true);
        expect(message.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 10);
    });

    it('should validate edited content', () => {
      const messageData = {
        content: 'Mensagem original',
        userId: 'user-123',
        roomId: 'room-456',
      };

      const message = new Message(messageData);

      expect(() => message.edit('')).toThrow('Mensagem inválida');
    });
  });

  describe('toJSON method', () => {
    it('should return JSON representation', () => {
      const messageData = {
        content: 'Olá pessoal!',
        userId: 'user-123',
        roomId: 'room-456',
      };

      const message = new Message(messageData);
      const json = message.toJSON();

      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('content');
      expect(json).toHaveProperty('userId');
      expect(json).toHaveProperty('roomId');
      expect(json).toHaveProperty('messageType');
      expect(json).toHaveProperty('isEdited');
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');
    });
  });
});
