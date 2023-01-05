const express = require("express");
const path = require("path");
const http = require("http");
import router from "./routes/usersRouter";
import activeUsers from "./controller/chatServidor"

const app = express();
 
//http server
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
console.log('API UP!!! IN LOCALHOST PORT:', PORT);
server.listen(PORT);
