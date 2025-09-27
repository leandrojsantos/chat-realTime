const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { logger, logAudit } = require('../../infrastructure/logging/logger');

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
    const { CreateUserUseCase } = require('../../domain/useCases/userUseCases');
    const UserRepository = require('../../infrastructure/repositories/UserRepository');
    
    const userRepository = new UserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);
    
    const user = await createUserUseCase.execute(req.body);
    
    logAudit('USER_CREATED', user.id, { email: user.email });
    res.status(201).json(user);
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
    const { GetUserUseCase } = require('../../domain/useCases/userUseCases');
    const UserRepository = require('../../infrastructure/repositories/UserRepository');
    
    const userRepository = new UserRepository();
    const getUserUseCase = new GetUserUseCase(userRepository);
    
    const user = await getUserUseCase.execute(req.params.id);
    res.json(user);
  } catch (error) {
    logger.error('Erro ao buscar usuário:', error);
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     tags: [Users]
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
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const { UpdateUserUseCase } = require('../../domain/useCases/userUseCases');
    const UserRepository = require('../../infrastructure/repositories/UserRepository');
    
    const userRepository = new UserRepository();
    const updateUserUseCase = new UpdateUserUseCase(userRepository);
    
    const user = await updateUserUseCase.execute(req.params.id, req.body);
    
    logAudit('USER_UPDATED', req.params.id, req.body);
    res.json(user);
  } catch (error) {
    logger.error('Erro ao atualizar usuário:', error);
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Deletar usuário
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const { DeleteUserUseCase } = require('../../domain/useCases/userUseCases');
    const UserRepository = require('../../infrastructure/repositories/UserRepository');
    
    const userRepository = new UserRepository();
    const deleteUserUseCase = new DeleteUserUseCase(userRepository);
    
    const result = await deleteUserUseCase.execute(req.params.id);
    
    logAudit('USER_DELETED', req.params.id);
    res.json(result);
  } catch (error) {
    logger.error('Erro ao deletar usuário:', error);
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
    const { ListUsersUseCase } = require('../../domain/useCases/userUseCases');
    const UserRepository = require('../../infrastructure/repositories/UserRepository');
    
    const userRepository = new UserRepository();
    const listUsersUseCase = new ListUsersUseCase(userRepository);
    
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    const users = await listUsersUseCase.execute(limit, offset);
    res.json(users);
  } catch (error) {
    logger.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
