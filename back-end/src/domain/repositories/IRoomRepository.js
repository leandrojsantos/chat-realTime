class IRoomRepository {
  async create(room) {
    throw new Error('Método create deve ser implementado');
  }

  async findById(id) {
    throw new Error('Método findById deve ser implementado');
  }

  async findByName(name) {
    throw new Error('Método findByName deve ser implementado');
  }

  async update(id, roomData) {
    throw new Error('Método update deve ser implementado');
  }

  async delete(id) {
    throw new Error('Método delete deve ser implementado');
  }

  async findAll(limit = 10, offset = 0) {
    throw new Error('Método findAll deve ser implementado');
  }

  async findActiveRooms() {
    throw new Error('Método findActiveRooms deve ser implementado');
  }
}

module.exports = IRoomRepository;
