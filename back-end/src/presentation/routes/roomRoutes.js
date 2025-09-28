const express = require('express');
const router = express.Router();
const { logger } = require('../../infrastructure/logging/logger');

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
    const room = req.body;
    logger.info('Sala criada:', room);
    res.status(201).json({ message: 'Sala criada com sucesso', data: room });
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
    const { id } = req.params;
    // Simular sala
    const room = {
      id,
      name: 'Sala Teste',
      description: 'Sala de teste para desenvolvimento',
      maxUsers: 50,
      isActive: true
    };
    res.json(room);
  } catch (error) {
    logger.error('Erro ao buscar sala:', error);
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
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    // Simular lista de salas
    const rooms = [
      {
        id: '1',
        name: 'Sala Geral',
        description: 'Sala para conversas gerais',
        maxUsers: 100,
        isActive: true
      },
      {
        id: '2',
        name: 'Sala Desenvolvimento',
        description: 'Sala para discussões de desenvolvimento',
        maxUsers: 50,
        isActive: true
      }
    ];
    
    res.json(rooms);
  } catch (error) {
    logger.error('Erro ao listar salas:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;