const Room = require('../entities/Room');

class CreateRoomUseCase {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute(roomData) {
    try {
      // Verificar se sala já existe
      const existingRoom = await this.roomRepository.findByName(roomData.name);
      if (existingRoom) {
        throw new Error('Sala com este nome já existe');
      }

      // Criar nova entidade sala
      const room = new Room(roomData);

      // Salvar no repositório
      const createdRoom = await this.roomRepository.create(room);

      return createdRoom.toJSON();
    } catch (error) {
      throw new Error(`Erro ao criar sala: ${error.message}`);
    }
  }
}

class GetRoomUseCase {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute(roomId) {
    try {
      const room = await this.roomRepository.findById(roomId);
      if (!room) {
        throw new Error('Sala não encontrada');
      }

      return room.toJSON();
    } catch (error) {
      throw new Error(`Erro ao buscar sala: ${error.message}`);
    }
  }
}

class UpdateRoomUseCase {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute(roomId, roomData) {
    try {
      const room = await this.roomRepository.findById(roomId);
      if (!room) {
        throw new Error('Sala não encontrada');
      }

      room.update(roomData);
      const updatedRoom = await this.roomRepository.update(roomId, room);

      return updatedRoom.toJSON();
    } catch (error) {
      throw new Error(`Erro ao atualizar sala: ${error.message}`);
    }
  }
}

class DeleteRoomUseCase {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute(roomId) {
    try {
      const room = await this.roomRepository.findById(roomId);
      if (!room) {
        throw new Error('Sala não encontrada');
      }

      await this.roomRepository.delete(roomId);
      return { message: 'Sala deletada com sucesso' };
    } catch (error) {
      throw new Error(`Erro ao deletar sala: ${error.message}`);
    }
  }
}

class ListRoomsUseCase {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute(limit = 10, offset = 0) {
    try {
      const rooms = await this.roomRepository.findAll(limit, offset);
      return rooms.map(room => room.toJSON());
    } catch (error) {
      throw new Error(`Erro ao listar salas: ${error.message}`);
    }
  }
}

class ListActiveRoomsUseCase {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute() {
    try {
      const rooms = await this.roomRepository.findActiveRooms();
      return rooms.map(room => room.toJSON());
    } catch (error) {
      throw new Error(`Erro ao listar salas ativas: ${error.message}`);
    }
  }
}

module.exports = {
  CreateRoomUseCase,
  GetRoomUseCase,
  UpdateRoomUseCase,
  DeleteRoomUseCase,
  ListRoomsUseCase,
  ListActiveRoomsUseCase,
};
