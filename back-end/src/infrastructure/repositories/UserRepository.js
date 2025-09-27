const mongoose = require('mongoose');
const User = require('../../domain/entities/User');

const userSchema = new mongoose.Schema({
  _id: { type: String, default: () => require('uuid').v4() },
  name: { type: String, required: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true },
  dateOfBirth: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const UserModel = mongoose.model('User', userSchema);

class UserRepository {
  async create(user) {
    try {
      const userData = user.toJSON();
      const createdUser = await UserModel.create(userData);
      return User.fromJSON(createdUser.toObject());
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Email já está em uso');
      }
      throw error;
    }
  }

  async findById(id) {
    try {
      const user = await UserModel.findById(id);
      return user ? User.fromJSON(user.toObject()) : null;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const user = await UserModel.findOne({ email: email.toLowerCase() });
      return user ? User.fromJSON(user.toObject()) : null;
    } catch (error) {
      throw error;
    }
  }

  async update(id, user) {
    try {
      const userData = user.toJSON();
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { ...userData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      
      if (!updatedUser) {
        throw new Error('Usuário não encontrado');
      }
      
      return User.fromJSON(updatedUser.toObject());
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const result = await UserModel.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Usuário não encontrado');
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async findAll(limit = 10, offset = 0) {
    try {
      const users = await UserModel.find()
        .limit(limit)
        .skip(offset)
        .sort({ createdAt: -1 });
      
      return users.map(user => User.fromJSON(user.toObject()));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserRepository;
