const User = require('../../src/domain/entities/User');

describe('User Entity', () => {
  let user;

  beforeEach(() => {
    user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      dateBirthDay: '1990-01-01'
    });
  });

  describe('Constructor', () => {
    test('should create a user with valid data', () => {
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.dateBirthDay).toBe('1990-01-01');
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.status).toBe('offline');
      expect(user.lastActivity).toBeNull();
    });

    test('should generate a unique ID', () => {
      const user2 = new User({
        name: 'Jane Doe',
        email: 'jane@example.com',
        dateBirthDay: '1992-01-01'
      });
      
      expect(user.id).not.toBe(user2.id);
    });

    test('should set createdAt to current time', () => {
      const now = new Date();
      const userTime = new Date(user.createdAt);
      
      expect(userTime.getTime()).toBeLessThanOrEqual(now.getTime());
      expect(userTime.getTime()).toBeGreaterThan(now.getTime() - 1000);
    });
  });

  describe('Validation', () => {
    test('should validate required fields', () => {
      expect(() => {
        new User({});
      }).toThrow('Name is required');

      expect(() => {
        new User({ name: 'John' });
      }).toThrow('Email is required');

      expect(() => {
        new User({ name: 'John', email: 'john@example.com' });
      }).toThrow('Date of birth is required');
    });

    test('should validate name length', () => {
      expect(() => {
        new User({
          name: '',
          email: 'john@example.com',
          dateBirthDay: '1990-01-01'
        });
      }).toThrow('Name is required');

      expect(() => {
        new User({
          name: 'a'.repeat(51),
          email: 'john@example.com',
          dateBirthDay: '1990-01-01'
        });
      }).toThrow('Name cannot exceed 50 characters');
    });

    test('should validate email format', () => {
      expect(() => {
        new User({
          name: 'John',
          email: 'invalid-email',
          dateBirthDay: '1990-01-01'
        });
      }).toThrow('Invalid email format');
    });

    test('should validate date of birth', () => {
      expect(() => {
        new User({
          name: 'John',
          email: 'john@example.com',
          dateBirthDay: 'invalid-date'
        });
      }).toThrow('Invalid date format');

      expect(() => {
        new User({
          name: 'John',
          email: 'john@example.com',
          dateBirthDay: '2030-01-01'
        });
      }).toThrow('Date of birth cannot be in the future');
    });
  });

  describe('User Status', () => {
    test('should set user as online', () => {
      user.setOnline();
      expect(user.status).toBe('online');
      expect(user.lastActivity).toBeDefined();
    });

    test('should set user as offline', () => {
      user.setOffline();
      expect(user.status).toBe('offline');
    });

    test('should check if user is online', () => {
      expect(user.isOnline()).toBe(false);
      user.setOnline();
      expect(user.isOnline()).toBe(true);
    });

    test('should check if user is offline', () => {
      expect(user.isOffline()).toBe(true);
      user.setOnline();
      expect(user.isOffline()).toBe(false);
    });

    test('should update last activity', () => {
      const beforeUpdate = user.lastActivity;
      user.updateLastActivity();
      
      expect(user.lastActivity).toBeDefined();
      expect(user.lastActivity).not.toBe(beforeUpdate);
    });
  });

  describe('User Information', () => {
    test('should update user name', () => {
      user.updateName('Jane Doe');
      expect(user.name).toBe('Jane Doe');
    });

    test('should not update name if empty', () => {
      const originalName = user.name;
      user.updateName('');
      expect(user.name).toBe(originalName);
    });

    test('should update user email', () => {
      user.updateEmail('jane@example.com');
      expect(user.email).toBe('jane@example.com');
    });

    test('should not update email if invalid', () => {
      const originalEmail = user.email;
      user.updateEmail('invalid-email');
      expect(user.email).toBe(originalEmail);
    });

    test('should calculate age', () => {
      const age = user.calculateAge();
      const currentYear = new Date().getFullYear();
      const birthYear = new Date(user.dateBirthDay).getFullYear();
      
      expect(age).toBe(currentYear - birthYear);
    });
  });

  describe('User Rooms', () => {
    test('should join a room', () => {
      user.joinRoom('general');
      expect(user.rooms).toContain('general');
    });

    test('should not join duplicate rooms', () => {
      user.joinRoom('general');
      user.joinRoom('general');
      expect(user.rooms).toHaveLength(1);
    });

    test('should leave a room', () => {
      user.joinRoom('general');
      user.leaveRoom('general');
      expect(user.rooms).not.toContain('general');
    });

    test('should check if user is in room', () => {
      expect(user.isInRoom('general')).toBe(false);
      user.joinRoom('general');
      expect(user.isInRoom('general')).toBe(true);
    });

    test('should get room count', () => {
      expect(user.getRoomCount()).toBe(0);
      user.joinRoom('general');
      user.joinRoom('support');
      expect(user.getRoomCount()).toBe(2);
    });
  });

  describe('User Messages', () => {
    test('should increment message count', () => {
      expect(user.messageCount).toBe(0);
      user.incrementMessageCount();
      expect(user.messageCount).toBe(1);
    });

    test('should reset message count', () => {
      user.incrementMessageCount();
      user.incrementMessageCount();
      user.resetMessageCount();
      expect(user.messageCount).toBe(0);
    });

    test('should get message count', () => {
      expect(user.getMessageCount()).toBe(0);
      user.incrementMessageCount();
      expect(user.getMessageCount()).toBe(1);
    });
  });

  describe('User Preferences', () => {
    test('should set notification preference', () => {
      user.setNotificationPreference('email', true);
      expect(user.preferences.notifications.email).toBe(true);
    });

    test('should get notification preference', () => {
      user.setNotificationPreference('email', true);
      expect(user.getNotificationPreference('email')).toBe(true);
    });

    test('should set theme preference', () => {
      user.setTheme('dark');
      expect(user.preferences.theme).toBe('dark');
    });

    test('should get theme preference', () => {
      user.setTheme('light');
      expect(user.getTheme()).toBe('light');
    });
  });

  describe('Static Methods', () => {
    test('should create user from JSON', () => {
      const json = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        dateBirthDay: '1990-01-01',
        createdAt: new Date().toISOString(),
        status: 'offline',
        rooms: [],
        messageCount: 0
      };

      const userFromJson = User.fromJSON(json);
      
      expect(userFromJson.id).toBe('123');
      expect(userFromJson.name).toBe('John Doe');
      expect(userFromJson.email).toBe('john@example.com');
      expect(userFromJson.dateBirthDay).toBe('1990-01-01');
    });

    test('should validate email format', () => {
      expect(User.isValidEmail('test@example.com')).toBe(true);
      expect(User.isValidEmail('invalid-email')).toBe(false);
      expect(User.isValidEmail('')).toBe(false);
    });

    test('should validate date format', () => {
      expect(User.isValidDate('1990-01-01')).toBe(true);
      expect(User.isValidDate('invalid-date')).toBe(false);
      expect(User.isValidDate('')).toBe(false);
    });
  });
});
