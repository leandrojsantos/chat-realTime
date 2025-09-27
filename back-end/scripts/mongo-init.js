// MongoDB initialization script
db = db.getSiblingDB('chatdb');

// Create collections
db.createCollection('users');
db.createCollection('rooms');
db.createCollection('messages');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: 1 });

db.rooms.createIndex({ name: 1 }, { unique: true });
db.rooms.createIndex({ createdAt: 1 });

db.messages.createIndex({ roomId: 1, createdAt: 1 });
db.messages.createIndex({ userId: 1 });
db.messages.createIndex({ createdAt: 1 });

// Insert sample data
db.users.insertMany([
  {
    _id: ObjectId(),
    name: 'Admin',
    email: 'admin@chat.com',
    dateOfBirth: new Date('1990-01-01'),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.rooms.insertMany([
  {
    _id: ObjectId(),
    name: 'general',
    description: 'Sala geral para conversas',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: 'tech',
    description: 'Discussões sobre tecnologia',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('Database initialized successfully!');
