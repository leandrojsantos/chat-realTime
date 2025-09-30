const Room = require('../../src/domain/entities/Room');

describe('Room Entity', () => {
  let room;

  beforeEach(() => {
    room = new Room({
      name: 'General',
      description: 'General discussion room',
      type: 'public'
    });
  });

  describe('Constructor', () => {
    test('should create a room with valid data', () => {
      expect(room.name).toBe('General');
      expect(room.description).toBe('General discussion room');
      expect(room.type).toBe('public');
      expect(room.id).toBeDefined();
      expect(room.createdAt).toBeDefined();
      expect(room.users).toEqual([]);
      expect(room.messages).toEqual([]);
    });

    test('should generate a unique ID', () => {
      const room2 = new Room({
        name: 'Another Room',
        description: 'Another room',
        type: 'public'
      });
      
      expect(room.id).not.toBe(room2.id);
    });

    test('should set createdAt to current time', () => {
      const now = new Date();
      const roomTime = new Date(room.createdAt);
      
      expect(roomTime.getTime()).toBeLessThanOrEqual(now.getTime());
      expect(roomTime.getTime()).toBeGreaterThan(now.getTime() - 1000);
    });
  });

  describe('Validation', () => {
    test('should validate required fields', () => {
      expect(() => {
        new Room({});
      }).toThrow('Name is required');

      expect(() => {
        new Room({ name: 'Test Room' });
      }).toThrow('Type is required');
    });

    test('should validate name length', () => {
      expect(() => {
        new Room({
          name: '',
          type: 'public'
        });
      }).toThrow('Name is required');

      expect(() => {
        new Room({
          name: 'a'.repeat(51),
          type: 'public'
        });
      }).toThrow('Name cannot exceed 50 characters');
    });

    test('should validate room type', () => {
      expect(() => {
        new Room({
          name: 'Test Room',
          type: 'invalid'
        });
      }).toThrow('Invalid room type');
    });
  });

  describe('User Management', () => {
    test('should add a user to the room', () => {
      const user = { id: '1', name: 'John Doe' };
      room.addUser(user);
      
      expect(room.users).toHaveLength(1);
      expect(room.users[0]).toEqual(user);
    });

    test('should not add duplicate users', () => {
      const user = { id: '1', name: 'John Doe' };
      room.addUser(user);
      room.addUser(user);
      
      expect(room.users).toHaveLength(1);
    });

    test('should remove a user from the room', () => {
      const user = { id: '1', name: 'John Doe' };
      room.addUser(user);
      room.removeUser('1');
      
      expect(room.users).toHaveLength(0);
    });

    test('should check if user is in room', () => {
      const user = { id: '1', name: 'John Doe' };
      room.addUser(user);
      
      expect(room.hasUser('1')).toBe(true);
      expect(room.hasUser('2')).toBe(false);
    });

    test('should get user count', () => {
      expect(room.getUserCount()).toBe(0);
      
      room.addUser({ id: '1', name: 'John' });
      room.addUser({ id: '2', name: 'Jane' });
      
      expect(room.getUserCount()).toBe(2);
    });
  });

  describe('Message Management', () => {
    test('should add a message to the room', () => {
      const message = {
        id: '1',
        content: 'Hello',
        author: 'John',
        timestamp: new Date()
      };
      
      room.addMessage(message);
      
      expect(room.messages).toHaveLength(1);
      expect(room.messages[0]).toEqual(message);
    });

    test('should get recent messages', () => {
      const message1 = {
        id: '1',
        content: 'First message',
        author: 'John',
        timestamp: new Date(Date.now() - 1000)
      };
      
      const message2 = {
        id: '2',
        content: 'Second message',
        author: 'Jane',
        timestamp: new Date()
      };
      
      room.addMessage(message1);
      room.addMessage(message2);
      
      const recentMessages = room.getRecentMessages(1);
      expect(recentMessages).toHaveLength(1);
      expect(recentMessages[0].id).toBe('2');
    });

    test('should get message count', () => {
      expect(room.getMessageCount()).toBe(0);
      
      room.addMessage({ id: '1', content: 'Hello', author: 'John' });
      room.addMessage({ id: '2', content: 'Hi', author: 'Jane' });
      
      expect(room.getMessageCount()).toBe(2);
    });
  });

  describe('Room Settings', () => {
    test('should update room name', () => {
      room.updateName('Updated Room');
      expect(room.name).toBe('Updated Room');
    });

    test('should not update name if empty', () => {
      const originalName = room.name;
      room.updateName('');
      expect(room.name).toBe(originalName);
    });

    test('should update room description', () => {
      room.updateDescription('Updated description');
      expect(room.description).toBe('Updated description');
    });

    test('should set room as private', () => {
      room.setPrivate();
      expect(room.type).toBe('private');
    });

    test('should set room as public', () => {
      room.setPublic();
      expect(room.type).toBe('public');
    });

    test('should check if room is private', () => {
      expect(room.isPrivate()).toBe(false);
      room.setPrivate();
      expect(room.isPrivate()).toBe(true);
    });

    test('should check if room is public', () => {
      expect(room.isPublic()).toBe(true);
      room.setPrivate();
      expect(room.isPublic()).toBe(false);
    });
  });

  describe('Room Status', () => {
    test('should activate room', () => {
      room.activate();
      expect(room.status).toBe('active');
    });

    test('should deactivate room', () => {
      room.deactivate();
      expect(room.status).toBe('inactive');
    });

    test('should check if room is active', () => {
      expect(room.isActive()).toBe(true);
      room.deactivate();
      expect(room.isActive()).toBe(false);
    });
  });

  describe('Static Methods', () => {
    test('should create room from JSON', () => {
      const json = {
        id: '123',
        name: 'Test Room',
        description: 'Test description',
        type: 'public',
        createdAt: new Date().toISOString(),
        users: [],
        messages: []
      };

      const roomFromJson = Room.fromJSON(json);
      
      expect(roomFromJson.id).toBe('123');
      expect(roomFromJson.name).toBe('Test Room');
      expect(roomFromJson.description).toBe('Test description');
      expect(roomFromJson.type).toBe('public');
    });

    test('should validate room type', () => {
      expect(Room.isValidType('public')).toBe(true);
      expect(Room.isValidType('private')).toBe(true);
      expect(Room.isValidType('invalid')).toBe(false);
    });
  });
});
