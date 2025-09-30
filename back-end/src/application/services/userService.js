const User = require('../../domain/entities/User');

class UserService {
  constructor() {
    this.users = [
      new User({
        name: 'John Doe',
        email: 'john@example.com',
        dateBirthDay: '1990-01-01'
      }),
      new User({
        name: 'Jane Smith',
        email: 'jane@example.com',
        dateBirthDay: '1992-05-15'
      })
    ];
  }

  async getAllUsers() {
    try {
      return this.users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        lastActivity: user.lastActivity,
        messageCount: user.getMessageCount(),
        roomCount: user.getRoomCount()
      }));
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  async createUser(userData) {
    try {
      const user = new User(userData);
      this.users.push(user);
      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async getUserById(userId) {
    try {
      const user = this.users.find(u => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  async updateUser(userId, updateData) {
    try {
      const userIndex = this.users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      const user = this.users[userIndex];
      if (updateData.name) user.updateName(updateData.name);
      if (updateData.email) user.updateEmail(updateData.email);
      if (updateData.status) {
        if (updateData.status === 'online') user.setOnline();
        if (updateData.status === 'offline') user.setOffline();
      }
      
      return user;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async deleteUser(userId) {
    try {
      const userIndex = this.users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      const deletedUser = this.users.splice(userIndex, 1)[0];
      return deletedUser;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = this.users.find(u => u.email === email);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Failed to get user by email: ${error.message}`);
    }
  }

  async setUserOnline(userId) {
    try {
      const user = await this.getUserById(userId);
      user.setOnline();
      return user;
    } catch (error) {
      throw new Error(`Failed to set user online: ${error.message}`);
    }
  }

  async setUserOffline(userId) {
    try {
      const user = await this.getUserById(userId);
      user.setOffline();
      return user;
    } catch (error) {
      throw new Error(`Failed to set user offline: ${error.message}`);
    }
  }
}

module.exports = new UserService();

