const User = require('../../src/domain/entities/User');

describe('User Entity Tests', () => {
  describe('Constructor', () => {
    it('should create a valid user', () => {
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        dateOfBirth: '1990-01-01',
      };

      const user = new User(userData);

      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.dateOfBirth).toBe(userData.dateOfBirth);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should generate UUID if not provided', () => {
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        dateOfBirth: '1990-01-01',
      };

      const user = new User(userData);
      expect(user.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should use provided ID if given', () => {
      const userData = {
        id: 'custom-id-123',
        name: 'João Silva',
        email: 'joao@example.com',
        dateOfBirth: '1990-01-01',
      };

      const user = new User(userData);
      expect(user.id).toBe('custom-id-123');
    });
  });

  describe('Validation', () => {
    it('should throw error for invalid email', () => {
      const userData = {
        name: 'João Silva',
        email: 'invalid-email',
        dateOfBirth: '1990-01-01',
      };

      expect(() => new User(userData)).toThrow('Usuário inválido');
    });

    it('should throw error for missing name', () => {
      const userData = {
        email: 'joao@example.com',
        dateOfBirth: '1990-01-01',
      };

      expect(() => new User(userData)).toThrow('Usuário inválido');
    });

    it('should throw error for name too short', () => {
      const userData = {
        name: 'J',
        email: 'joao@example.com',
        dateOfBirth: '1990-01-01',
      };

      expect(() => new User(userData)).toThrow('Usuário inválido');
    });

    it('should throw error for name too long', () => {
      const userData = {
        name: 'A'.repeat(101),
        email: 'joao@example.com',
        dateOfBirth: '1990-01-01',
      };

      expect(() => new User(userData)).toThrow('Usuário inválido');
    });

    it('should throw error for future birth date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        dateOfBirth: futureDate.toISOString(),
      };

      expect(() => new User(userData)).toThrow('Usuário inválido');
    });
  });

  describe('Update method', () => {
    it('should update user data', () => {
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        dateOfBirth: '1990-01-01',
      };

      const user = new User(userData);
      const originalUpdatedAt = user.updatedAt;

      // Aguardar um pouco para garantir que a data seja diferente
      setTimeout(() => {
        user.update({ name: 'João Santos' });
        
        expect(user.name).toBe('João Santos');
        expect(user.email).toBe(userData.email); // Não deve mudar
        expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 10);
    });

    it('should validate updated data', () => {
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        dateOfBirth: '1990-01-01',
      };

      const user = new User(userData);

      expect(() => user.update({ name: 'J' })).toThrow('Usuário inválido');
    });
  });

  describe('toJSON method', () => {
    it('should return JSON representation', () => {
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        dateOfBirth: '1990-01-01',
      };

      const user = new User(userData);
      const json = user.toJSON();

      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('name');
      expect(json).toHaveProperty('email');
      expect(json).toHaveProperty('dateOfBirth');
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');
    });
  });

  describe('fromJSON method', () => {
    it('should create user from JSON', () => {
      const jsonData = {
        id: 'test-id',
        name: 'João Silva',
        email: 'joao@example.com',
        dateOfBirth: '1990-01-01',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const user = User.fromJSON(jsonData);

      expect(user.id).toBe(jsonData.id);
      expect(user.name).toBe(jsonData.name);
      expect(user.email).toBe(jsonData.email);
    });
  });
});
