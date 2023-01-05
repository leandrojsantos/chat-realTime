const { v4: uuidv4 } = require('uuid');
const userRules = require('./usersRules');

const getRoom = (req, res) => {
  const randomGenUniqueName = uuidv4();
  res.status(200).send({ roomUrl: randomGenUniqueName });
};

const postAddUser = (req, res) => {
  const { name } = req.body;
  const userRules = new User(null, name);
  userRules.save();
  res.status(200).send({ success: true, msg: 'Usuario adicionado' });
};

module.exports = {
  postAddUser,
  getRoom,
};
