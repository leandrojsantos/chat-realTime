/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da sala
 *         name:
 *           type: string
 *           description: Nome da sala
 *         description:
 *           type: string
 *           description: Descrição da sala
 *         maxUsers:
 *           type: integer
 *           description: Número máximo de usuários
 *         isActive:
 *           type: boolean
 *           description: Se a sala está ativa
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

class Room {
  constructor({ id, name, description, maxUsers = 50, isActive = true, createdAt, updatedAt }) {
    this.id = id || uuidv4();
    this.name = name;
    this.description = description;
    this.maxUsers = maxUsers;
    this.isActive = isActive;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    
    this.validate();
  }

  validate() {
    const schema = Joi.object({
      id: Joi.string().uuid().required(),
      name: Joi.string().min(2).max(50).required(),
      description: Joi.string().min(5).max(200).required(),
      maxUsers: Joi.number().integer().min(2).max(1000).required(),
      isActive: Joi.boolean().required(),
      createdAt: Joi.date().required(),
      updatedAt: Joi.date().required(),
    });

    const { error } = schema.validate(this);
    if (error) {
      throw new Error(`Sala inválida: ${error.details[0].message}`);
    }
  }

  update({ name, description, maxUsers, isActive }) {
    if (name) this.name = name;
    if (description) this.description = description;
    if (maxUsers !== undefined) this.maxUsers = maxUsers;
    if (isActive !== undefined) this.isActive = isActive;
    this.updatedAt = new Date();
    this.validate();
  }

  canJoinRoom(currentUserCount) {
    return this.isActive && currentUserCount < this.maxUsers;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      maxUsers: this.maxUsers,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromJSON(data) {
    return new Room(data);
  }
}

module.exports = Room;
