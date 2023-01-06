const { v4: uuidv4 } = require('uuid');
const userRule = require('./userRule');

const getRoom = (req, res) => {
  const randomGenUniqueName = uuidv4();
  res.status(200).send({ roomUrl: randomGenUniqueName });
};

const postAddUser = (req, res) => {
  const { name } = req.body;
  const userRule = new User(null, name);
  userRule.save();
  res.status(200).send({ success: true, msg: 'Usuario adicionado' });
};

module.exports = {
  postAddUser,
  getRoom,

};
