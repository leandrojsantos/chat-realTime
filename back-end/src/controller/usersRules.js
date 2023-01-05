const users = [];

const addUser = ({ id, name, email, dateBirth, room }) => {
  name = name.trim().toLowerCase();
  email = email.trim().toLowerCase();
  dateBirth = dateBirth.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => user.room === room && user.email === email);
  if(!name || !room) return { error: 'Nome, email e data de nascimento são necessário.' };
  if(existingUser) return { error: 'Email já existe' };

  const user = { id, name, email, dateBirth, room  };
  users.push(user);
    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };