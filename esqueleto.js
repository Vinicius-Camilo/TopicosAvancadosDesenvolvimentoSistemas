const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Armazenar os jogadores
let players = {};

// Inicia o socket.io
io.on('connection', (socket) => {

});


server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000...');
});