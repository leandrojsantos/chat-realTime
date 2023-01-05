import { Socket } from "socket.io";
import { CorsRequest } from "cors";

// Criando conexão de socket, um ​​socket é um ponto final de um link de comunicação bidirecional entre dois programas em execução na rede. Com um endpoint é uma combinação de um endereço IP e número de porta torna um chat em tempo real.

const users = new Set();
let roomId = "";
io.on("connection", (socket) => {

// 0 - Entrando na sala para conversa
socket.on("JOIN_ROOM", (room) => {
    roomId = room;
    socket.join(room);
});

/**  
 * 1 - Para emitir um evento do seu cliente, use a função “emit” no objeto socket
 * 2 - Para lidar com esses eventos, use a função “on” no	no objeto socket
 * 3 - Criar um evento NEW_MESSAGE. Ele será usado para envia mensagens do lado do cliente.
 * */

// 4 - Ouça NEW_MESSAGE para receber novas mensagens
socket.on("NEW_MESSAGE", (msg) => {
    io.to(roomId).emit("NEW_MESSAGE", msg);
});

// 5 - Para desconectar o participante da sala, remove usuário específico do objeto
socket.on("disconnect", () => {
    users.delete(socket.userId);
    io.to(roomId).emit("user disconnected", socket.userId);
    });
});

module.exports = users;