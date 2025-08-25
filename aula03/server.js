const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // Servir arquivos estáticos da pasta 'public'

// Armazenar os jogadores
let players = {};

// Inicia o socket.io
io.on('connection', (socket) => {
    console.log(`Novo jogador conectado: ${socket.id}`);

    //Criar o jogador na posição inicial
    players[socket.id] = {
        x: 50,
        y: 50,
        color: getRandomColor() 
        //adicionar mais propriedades se necessário
    };

    // Enviar o estado atual dos jogadores apenas para o novo jogador
    socket.emit('currentPlayers', players);

    // Notificar todos os jogadores sobre o novo jogador
    socket.broadcast.emit('newPlayer', {id: socket.id, ...players[socket.id]});

    //Movimento do jogador
    socket.on('move', (direction) => {
        const player = players[socket.id];
        if(!player) return; // Se o jogador não existir, sair

        const speed = 5;
        if (direction === 'left') player.x -= speed;
        else if (direction === 'right') player.x += speed;
        else if (direction === 'up') player.y -= speed;
        else if (direction === 'down') player.y += speed;

        io.emit('playerMoved', {id: socket.id, x: player.x, y: player.y}); // Notificar todos os jogadores sobre o movimento
    });

    // Desconexão do jogador
    socket.on('disconnect', () => {
        console.log(`Jogador saiu: ${socket.id}`); // Log no servidor
        delete players[socket.id]; // Remover o jogador da lista
        io.emit('playerDisconnected', socket.id); // Notificar todos os jogadores sobre a desconexão
    });
});

function getRandomColor() {
    const letters = '0123456789ABCDEF'; //gerar cor hexadecimal aleatória
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]; //adicionar um caractere aleatório
    }
    return color;
}

// Inicia o servidor
server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000...');
});