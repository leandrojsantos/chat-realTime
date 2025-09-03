// Controlador do chat
class ChatController {
  constructor(socketService) {
    this.socketService = socketService;
  }

  // Obter informações de uma sala
  getRoomInfo(req, res) {
    try {
      const { roomName } = req.params;
      const roomInfo = this.socketService.getRoomInfo(roomName);
      
      if (!roomInfo) {
        return res.status(404).json({ 
          success: false, 
          message: 'Sala não encontrada' 
        });
      }

      res.json({
        success: true,
        data: roomInfo.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // Obter lista de salas
  getRoomsList(req, res) {
    try {
      const rooms = this.socketService.getRoomsList();
      
      res.json({
        success: true,
        data: rooms
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // Obter usuários conectados
  getConnectedUsers(req, res) {
    try {
      const users = this.socketService.getConnectedUsers();
      
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // Estatísticas do sistema
  getSystemStats(req, res) {
    try {
      const stats = {
        totalRooms: this.socketService.getRoomsList().length,
        totalUsers: this.socketService.getConnectedUsers().length,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }
}

module.exports = ChatController;


