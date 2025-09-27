class IUserRepository {
  async create(user) {
    throw new Error('Método create deve ser implementado');
  }

  async findById(id) {
    throw new Error('Método findById deve ser implementado');
  }

  async findByEmail(email) {
    throw new Error('Método findByEmail deve ser implementado');
  }

  async update(id, userData) {
    throw new Error('Método update deve ser implementado');
  }

  async delete(id) {
    throw new Error('Método delete deve ser implementado');
  }

  async findAll(limit = 10, offset = 0) {
    throw new Error('Método findAll deve ser implementado');
  }
}

module.exports = IUserRepository;
