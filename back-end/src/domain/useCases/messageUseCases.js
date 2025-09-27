const Message = require('../entities/Message');

class SendMessageUseCase {
  constructor(messageRepository, userRepository, roomRepository) {
    this.messageRepository = messageRepository;
    this.userRepository = userRepository;
    this.roomRepository = roomRepository;
  }

  async execute(messageData) {
    try {
      // Verificar se usuário existe
      const user = await this.userRepository.findById(messageData.userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar se sala existe
      const room = await this.roomRepository.findById(messageData.roomId);
      if (!room) {
        throw new Error('Sala não encontrada');
      }

      // Criar nova entidade mensagem
      const message = new Message(messageData);

      // Salvar no repositório
      const createdMessage = await this.messageRepository.create(message);

      return createdMessage.toJSON();
    } catch (error) {
      throw new Error(`Erro ao enviar mensagem: ${error.message}`);
    }
  }
}

class GetMessagesUseCase {
  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }

  async execute(roomId, limit = 50, offset = 0) {
    try {
      const messages = await this.messageRepository.findByRoomId(roomId, limit, offset);
      return messages.map(message => message.toJSON());
    } catch (error) {
      throw new Error(`Erro ao buscar mensagens: ${error.message}`);
    }
  }
}

class EditMessageUseCase {
  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }

  async execute(messageId, newContent) {
    try {
      const message = await this.messageRepository.findById(messageId);
      if (!message) {
        throw new Error('Mensagem não encontrada');
      }

      message.edit(newContent);
      const updatedMessage = await this.messageRepository.update(messageId, message);

      return updatedMessage.toJSON();
    } catch (error) {
      throw new Error(`Erro ao editar mensagem: ${error.message}`);
    }
  }
}

class DeleteMessageUseCase {
  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }

  async execute(messageId) {
    try {
      const message = await this.messageRepository.findById(messageId);
      if (!message) {
        throw new Error('Mensagem não encontrada');
      }

      await this.messageRepository.delete(messageId);
      return { message: 'Mensagem deletada com sucesso' };
    } catch (error) {
      throw new Error(`Erro ao deletar mensagem: ${error.message}`);
    }
  }
}

class GetRecentMessagesUseCase {
  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }

  async execute(roomId, limit = 20) {
    try {
      const messages = await this.messageRepository.findRecentMessages(roomId, limit);
      return messages.map(message => message.toJSON());
    } catch (error) {
      throw new Error(`Erro ao buscar mensagens recentes: ${error.message}`);
    }
  }
}

module.exports = {
  SendMessageUseCase,
  GetMessagesUseCase,
  EditMessageUseCase,
  DeleteMessageUseCase,
  GetRecentMessagesUseCase,
};
