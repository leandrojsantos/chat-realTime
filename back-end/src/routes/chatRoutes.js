const express = require('express');
const router = express.Router();

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
    const message = req.body;
    console.log('Mensagem recebida:', message);
    res.status(201).json({ message: 'Mensagem enviada com sucesso', data: message });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
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
    const { roomId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    // Simular mensagens
    const messages = [
      {
        id: '1',
        content: 'Olá! Bem-vindo ao chat!',
        roomId,
        timestamp: new Date().toISOString()
      }
    ];
    
    res.json(messages);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
