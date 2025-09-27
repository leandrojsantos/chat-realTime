class IMessageRepository {
  async create(message) {
    throw new Error('Método create deve ser implementado');
  }

  async findById(id) {
    throw new Error('Método findById deve ser implementado');
  }

  async findByRoomId(roomId, limit = 50, offset = 0) {
    throw new Error('Método findByRoomId deve ser implementado');
  }

  async update(id, messageData) {
    throw new Error('Método update deve ser implementado');
  }

  async delete(id) {
    throw new Error('Método delete deve ser implementado');
  }

  async findRecentMessages(roomId, limit = 20) {
    throw new Error('Método findRecentMessages deve ser implementado');
  }
}

module.exports = IMessageRepository;
