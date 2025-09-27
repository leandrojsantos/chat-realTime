const express = require('express');
const router = express.Router();
const { logger, logAudit } = require('../../infrastructure/logging/logger');

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Criar nova sala
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               maxUsers:
 *                 type: integer
 *                 default: 50
 *     responses:
 *       201:
 *         description: Sala criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Nome da sala já existe
 */
router.post('/', async (req, res) => {
  try {
    const { CreateRoomUseCase } = require('../../domain/useCases/roomUseCases');
    const RoomRepository = require('../../infrastructure/repositories/RoomRepository');
    
    const roomRepository = new RoomRepository();
    const createRoomUseCase = new CreateRoomUseCase(roomRepository);
    
    const room = await createRoomUseCase.execute(req.body);
    
    logAudit('ROOM_CREATED', room.id, { name: room.name });
    res.status(201).json(room);
  } catch (error) {
    logger.error('Erro ao criar sala:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Buscar sala por ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sala encontrada
 *       404:
 *         description: Sala não encontrada
 */
router.get('/:id', async (req, res) => {
  try {
    const { GetRoomUseCase } = require('../../domain/useCases/roomUseCases');
    const RoomRepository = require('../../infrastructure/repositories/RoomRepository');
    
    const roomRepository = new RoomRepository();
    const getRoomUseCase = new GetRoomUseCase(roomRepository);
    
    const room = await getRoomUseCase.execute(req.params.id);
    res.json(room);
  } catch (error) {
    logger.error('Erro ao buscar sala:', error);
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Atualizar sala
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               maxUsers:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Sala atualizada com sucesso
 *       404:
 *         description: Sala não encontrada
 */
router.put('/:id', async (req, res) => {
  try {
    const { UpdateRoomUseCase } = require('../../domain/useCases/roomUseCases');
    const RoomRepository = require('../../infrastructure/repositories/RoomRepository');
    
    const roomRepository = new RoomRepository();
    const updateRoomUseCase = new UpdateRoomUseCase(roomRepository);
    
    const room = await updateRoomUseCase.execute(req.params.id, req.body);
    
    logAudit('ROOM_UPDATED', req.params.id, req.body);
    res.json(room);
  } catch (error) {
    logger.error('Erro ao atualizar sala:', error);
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Deletar sala
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sala deletada com sucesso
 *       404:
 *         description: Sala não encontrada
 */
router.delete('/:id', async (req, res) => {
  try {
    const { DeleteRoomUseCase } = require('../../domain/useCases/roomUseCases');
    const RoomRepository = require('../../infrastructure/repositories/RoomRepository');
    
    const roomRepository = new RoomRepository();
    const deleteRoomUseCase = new DeleteRoomUseCase(roomRepository);
    
    const result = await deleteRoomUseCase.execute(req.params.id);
    
    logAudit('ROOM_DELETED', req.params.id);
    res.json(result);
  } catch (error) {
    logger.error('Erro ao deletar sala:', error);
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Listar salas
 *     tags: [Rooms]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Lista de salas
 */
router.get('/', async (req, res) => {
  try {
    const { ListRoomsUseCase } = require('../../domain/useCases/roomUseCases');
    const RoomRepository = require('../../infrastructure/repositories/RoomRepository');
    
    const roomRepository = new RoomRepository();
    const listRoomsUseCase = new ListRoomsUseCase(roomRepository);
    
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    const rooms = await listRoomsUseCase.execute(limit, offset);
    res.json(rooms);
  } catch (error) {
    logger.error('Erro ao listar salas:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/rooms/active:
 *   get:
 *     summary: Listar salas ativas
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: Lista de salas ativas
 */
router.get('/active', async (req, res) => {
  try {
    const { ListActiveRoomsUseCase } = require('../../domain/useCases/roomUseCases');
    const RoomRepository = require('../../infrastructure/repositories/RoomRepository');
    
    const roomRepository = new RoomRepository();
    const listActiveRoomsUseCase = new ListActiveRoomsUseCase(roomRepository);
    
    const rooms = await listActiveRoomsUseCase.execute();
    res.json(rooms);
  } catch (error) {
    logger.error('Erro ao listar salas ativas:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
