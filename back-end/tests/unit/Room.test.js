const Room = require('../../src/domain/entities/Room');

describe('Room Entity Tests', () => {
  describe('Constructor', () => {
    it('should create a valid room', () => {
      const roomData = {
        name: 'general',
        description: 'Sala geral para conversas',
        maxUsers: 50,
      };

      const room = new Room(roomData);

      expect(room.name).toBe(roomData.name);
      expect(room.description).toBe(roomData.description);
      expect(room.maxUsers).toBe(roomData.maxUsers);
      expect(room.isActive).toBe(true);
      expect(room.id).toBeDefined();
      expect(room.createdAt).toBeDefined();
      expect(room.updatedAt).toBeDefined();
    });

    it('should use default values', () => {
      const roomData = {
        name: 'general',
        description: 'Sala geral para conversas',
      };

      const room = new Room(roomData);

      expect(room.maxUsers).toBe(50);
      expect(room.isActive).toBe(true);
    });
  });

  describe('Validation', () => {
    it('should throw error for missing name', () => {
      const roomData = {
        description: 'Sala geral para conversas',
      };

      expect(() => new Room(roomData)).toThrow('Sala inválida');
    });

    it('should throw error for name too short', () => {
      const roomData = {
        name: 'A',
        description: 'Sala geral para conversas',
      };

      expect(() => new Room(roomData)).toThrow('Sala inválida');
    });

    it('should throw error for name too long', () => {
      const roomData = {
        name: 'A'.repeat(51),
        description: 'Sala geral para conversas',
      };

      expect(() => new Room(roomData)).toThrow('Sala inválida');
    });

    it('should throw error for description too short', () => {
      const roomData = {
        name: 'general',
        description: 'Sala',
      };

      expect(() => new Room(roomData)).toThrow('Sala inválida');
    });

    it('should throw error for maxUsers too low', () => {
      const roomData = {
        name: 'general',
        description: 'Sala geral para conversas',
        maxUsers: 1,
      };

      expect(() => new Room(roomData)).toThrow('Sala inválida');
    });

    it('should throw error for maxUsers too high', () => {
      const roomData = {
        name: 'general',
        description: 'Sala geral para conversas',
        maxUsers: 1001,
      };

      expect(() => new Room(roomData)).toThrow('Sala inválida');
    });
  });

  describe('canJoinRoom method', () => {
    it('should allow joining when room is active and has capacity', () => {
      const roomData = {
        name: 'general',
        description: 'Sala geral para conversas',
        maxUsers: 50,
      };

      const room = new Room(roomData);

      expect(room.canJoinRoom(25)).toBe(true);
    });

    it('should not allow joining when room is inactive', () => {
      const roomData = {
        name: 'general',
        description: 'Sala geral para conversas',
        maxUsers: 50,
        isActive: false,
      };

      const room = new Room(roomData);

      expect(room.canJoinRoom(25)).toBe(false);
    });

    it('should not allow joining when room is full', () => {
      const roomData = {
        name: 'general',
        description: 'Sala geral para conversas',
        maxUsers: 50,
      };

      const room = new Room(roomData);

      expect(room.canJoinRoom(50)).toBe(false);
    });
  });

  describe('Update method', () => {
    it('should update room data', () => {
      const roomData = {
        name: 'general',
        description: 'Sala geral para conversas',
        maxUsers: 50,
      };

      const room = new Room(roomData);
      const originalUpdatedAt = room.updatedAt;

      setTimeout(() => {
        room.update({ 
          name: 'general-updated',
          description: 'Sala geral atualizada',
          maxUsers: 100 
        });
        
        expect(room.name).toBe('general-updated');
        expect(room.description).toBe('Sala geral atualizada');
        expect(room.maxUsers).toBe(100);
        expect(room.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 10);
    });
  });
});
