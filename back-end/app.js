require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const userRoutes = require('./src/routes/userRouter');

app.use(cors());
app.options('*', cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const activeUsers = new Set();
let roomId = '';

io.on('connection', (socket) => {
  socket.on('JOIN_ROOM', (room) => {
    roomId = room;
    socket.join(room);
  });

  socket.on('NEW_MESSAGE', (msg) => {
    io.to(roomId).emit('NEW_MESSAGE', msg);
  });

  socket.on('disconnect', () => {
    activeUsers.delete(socket.userId);
    io.to(roomId).emit('user disconnected', socket.userId);
  });
});

const PORT = process.env.PORT || 3000;
console.log('Server listening on PORT: ', PORT);
server.listen(PORT);
