const express = require('express');
const router = express.Router();
const { logger, logAudit } = require('../../infrastructure/logging/logger');

/**
 * @swagger
 * /api/chat/messages:
 *   post:
 *     summary: Enviar mensagem
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - userId
 *               - roomId
 *             properties:
 *               content:
 *                 type: string
 *               userId:
 *                 type: string
 *               roomId:
 *                 type: string
 *               messageType:
 *                 type: string
 *                 enum: [text, image, file, system]
 *                 default: text
 *     responses:
 *       201:
 *         description: Mensagem enviada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/messages', async (req, res) => {
  try {
    const { SendMessageUseCase } = require('../../domain/useCases/messageUseCases');
    const MessageRepository = require('../../infrastructure/repositories/MessageRepository');
    const UserRepository = require('../../infrastructure/repositories/UserRepository');
    const RoomRepository = require('../../infrastructure/repositories/RoomRepository');
    
    const messageRepository = new MessageRepository();
    const userRepository = new UserRepository();
    const roomRepository = new RoomRepository();
    const sendMessageUseCase = new SendMessageUseCase(messageRepository, userRepository, roomRepository);
    
    const message = await sendMessageUseCase.execute(req.body);
    
    logAudit('MESSAGE_SENT', req.body.userId, { roomId: req.body.roomId, messageId: message.id });
    res.status(201).json(message);
  } catch (error) {
    logger.error('Erro ao enviar mensagem:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/chat/messages/{roomId}:
 *   get:
 *     summary: Buscar mensagens de uma sala
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Lista de mensagens
 */
router.get('/messages/:roomId', async (req, res) => {
  try {
    const { GetMessagesUseCase } = require('../../domain/useCases/messageUseCases');
    const MessageRepository = require('../../infrastructure/repositories/MessageRepository');
    
    const messageRepository = new MessageRepository();
    const getMessagesUseCase = new GetMessagesUseCase(messageRepository);
    
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const messages = await getMessagesUseCase.execute(req.params.roomId, limit, offset);
    res.json(messages);
  } catch (error) {
    logger.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/chat/messages/{messageId}:
 *   put:
 *     summary: Editar mensagem
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mensagem editada com sucesso
 *       404:
 *         description: Mensagem não encontrada
 */
router.put('/messages/:messageId', async (req, res) => {
  try {
    const { EditMessageUseCase } = require('../../domain/useCases/messageUseCases');
    const MessageRepository = require('../../infrastructure/repositories/MessageRepository');
    
    const messageRepository = new MessageRepository();
    const editMessageUseCase = new EditMessageUseCase(messageRepository);
    
    const message = await editMessageUseCase.execute(req.params.messageId, req.body.content);
    
    logAudit('MESSAGE_EDITED', message.userId, { messageId: message.id });
    res.json(message);
  } catch (error) {
    logger.error('Erro ao editar mensagem:', error);
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/chat/messages/{messageId}:
 *   delete:
 *     summary: Deletar mensagem
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mensagem deletada com sucesso
 *       404:
 *         description: Mensagem não encontrada
 */
router.delete('/messages/:messageId', async (req, res) => {
  try {
    const { DeleteMessageUseCase } = require('../../domain/useCases/messageUseCases');
    const MessageRepository = require('../../infrastructure/repositories/MessageRepository');
    
    const messageRepository = new MessageRepository();
    const deleteMessageUseCase = new DeleteMessageUseCase(messageRepository);
    
    const result = await deleteMessageUseCase.execute(req.params.messageId);
    
    logAudit('MESSAGE_DELETED', req.params.messageId);
    res.json(result);
  } catch (error) {
    logger.error('Erro ao deletar mensagem:', error);
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/chat/recent/{roomId}:
 *   get:
 *     summary: Buscar mensagens recentes de uma sala
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Lista de mensagens recentes
 */
router.get('/recent/:roomId', async (req, res) => {
  try {
    const { GetRecentMessagesUseCase } = require('../../domain/useCases/messageUseCases');
    const MessageRepository = require('../../infrastructure/repositories/MessageRepository');
    
    const messageRepository = new MessageRepository();
    const getRecentMessagesUseCase = new GetRecentMessagesUseCase(messageRepository);
    
    const limit = parseInt(req.query.limit) || 20;
    
    const messages = await getRecentMessagesUseCase.execute(req.params.roomId, limit);
    res.json(messages);
  } catch (error) {
    logger.error('Erro ao buscar mensagens recentes:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
