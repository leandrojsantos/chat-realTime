const express = require('express');
const router = express.Router();
const { logger } = require('../../infrastructure/logging/logger');

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Criar novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - dateOfBirth
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já existe
 */
router.post('/', async (req, res) => {
  try {
    const user = req.body;
    logger.info('Usuário criado:', user);
    res.status(201).json({ message: 'Usuário criado com sucesso', data: user });
  } catch (error) {
    logger.error('Erro ao criar usuário:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Simular usuário
    const user = {
      id,
      name: 'Usuário Teste',
      email: 'teste@example.com',
      dateOfBirth: '1990-01-01'
    };
    res.json(user);
  } catch (error) {
    logger.error('Erro ao buscar usuário:', error);
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar usuários
 *     tags: [Users]
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
 *         description: Lista de usuários
 */
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    // Simular lista de usuários
    const users = [
      {
        id: '1',
        name: 'Usuário 1',
        email: 'user1@example.com',
        dateOfBirth: '1990-01-01'
      },
      {
        id: '2',
        name: 'Usuário 2',
        email: 'user2@example.com',
        dateOfBirth: '1991-01-01'
      }
    ];
    
    res.json(users);
  } catch (error) {
    logger.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;