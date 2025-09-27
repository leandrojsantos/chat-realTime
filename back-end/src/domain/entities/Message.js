/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - content
 *         - userId
 *         - roomId
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da mensagem
 *         content:
 *           type: string
 *           description: Conteúdo da mensagem
 *         userId:
 *           type: string
 *           description: ID do usuário que enviou
 *         roomId:
 *           type: string
 *           description: ID da sala
 *         messageType:
 *           type: string
 *           enum: [text, image, file, system]
 *           description: Tipo da mensagem
 *         isEdited:
 *           type: boolean
 *           description: Se a mensagem foi editada
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de atualização
 */

const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');

class Message {
  constructor({ 
    id, 
    content, 
    userId, 
    roomId, 
    messageType = 'text', 
    isEdited = false, 
    createdAt, 
    updatedAt 
  }) {
    this.id = id || uuidv4();
    this.content = content;
    this.userId = userId;
    this.roomId = roomId;
    this.messageType = messageType;
    this.isEdited = isEdited;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    
    this.validate();
  }

  validate() {
    const schema = Joi.object({
      id: Joi.string().uuid().required(),
      content: Joi.string().min(1).max(2000).required(),
      userId: Joi.string().uuid().required(),
      roomId: Joi.string().uuid().required(),
      messageType: Joi.string().valid('text', 'image', 'file', 'system').required(),
      isEdited: Joi.boolean().required(),
      createdAt: Joi.date().required(),
      updatedAt: Joi.date().required(),
    });

    const { error } = schema.validate(this);
    if (error) {
      throw new Error(`Mensagem inválida: ${error.details[0].message}`);
    }
  }

  edit(newContent) {
    this.content = newContent;
    this.isEdited = true;
    this.updatedAt = new Date();
    this.validate();
  }

  toJSON() {
    return {
      id: this.id,
      content: this.content,
      userId: this.userId,
      roomId: this.roomId,
      messageType: this.messageType,
      isEdited: this.isEdited,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromJSON(data) {
    return new Message(data);
  }
}

module.exports = Message;
