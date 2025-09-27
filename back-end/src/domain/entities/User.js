/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - dateOfBirth
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do usuário
 *         name:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Data de nascimento
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

class User {
  constructor({ id, name, email, dateOfBirth, createdAt, updatedAt }) {
    this.id = id || uuidv4();
    this.name = name;
    this.email = email;
    this.dateOfBirth = dateOfBirth;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    
    this.validate();
  }

  validate() {
    const schema = Joi.object({
      id: Joi.string().uuid().required(),
      name: Joi.string().min(2).max(100).required(),
      email: Joi.string().email().required(),
      dateOfBirth: Joi.date().max('now').required(),
      createdAt: Joi.date().required(),
      updatedAt: Joi.date().required(),
    });

    const { error } = schema.validate(this);
    if (error) {
      throw new Error(`Usuário inválido: ${error.details[0].message}`);
    }
  }

  update({ name, dateOfBirth }) {
    if (name) this.name = name;
    if (dateOfBirth) this.dateOfBirth = dateOfBirth;
    this.updatedAt = new Date();
    this.validate();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      dateOfBirth: this.dateOfBirth,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromJSON(data) {
    return new User(data);
  }
}

module.exports = User;
