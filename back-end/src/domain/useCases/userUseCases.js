const User = require('../entities/User');

class CreateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData) {
    try {
      // Verificar se usuário já existe
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('Usuário com este email já existe');
      }

      // Criar nova entidade usuário
      const user = new User(userData);

      // Salvar no repositório
      const createdUser = await this.userRepository.create(user);

      return createdUser.toJSON();
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }
}

class GetUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return user.toJSON();
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }
}

class UpdateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId, userData) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      user.update(userData);
      const updatedUser = await this.userRepository.update(userId, user);

      return updatedUser.toJSON();
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }
}

class DeleteUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      await this.userRepository.delete(userId);
      return { message: 'Usuário deletado com sucesso' };
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }
}

class ListUsersUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(limit = 10, offset = 0) {
    try {
      const users = await this.userRepository.findAll(limit, offset);
      return users.map(user => user.toJSON());
    } catch (error) {
      throw new Error(`Erro ao listar usuários: ${error.message}`);
    }
  }
}

module.exports = {
  CreateUserUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  ListUsersUseCase,
};
