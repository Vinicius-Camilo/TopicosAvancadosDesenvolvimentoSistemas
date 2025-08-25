//client.js
const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Armazenar os jogadores no lado do cliente
let players = {};

// Recebe todos os jogadores atuais ao se conectar
socket.on('currentPlayers', (serverPlayers) => {
    players = serverPlayers;
    render(); //criar a função render
});

// Entrada de novo jogador
socket.on('newPlayer', (player) => {
    players[player.id] = player;
    render();
});

// Movimento de jogadores
socket.on('playerMoved', (data) => {
    if (players[data.id]) {
        players[data.id].x = data.x;
        players[data.id].y = data.y;
        render();
    }
});

// Saida de jogador
socket.on('playerDisconnected', (playerId) => {
    delete players[playerId];
    render();
});

// Movimentos do jogador com as setas do teclado
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') socket.emit('move', 'left');
    else if (event.key === 'ArrowRight') socket.emit('move', 'right');
    else if (event.key === 'ArrowUp') socket.emit('move', 'up');
    else if (event.key === 'ArrowDown') socket.emit('move', 'down');
});

// Renderização
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpar o canvas
    Object.values(players).forEach((player) => {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, 30, 30); // Desenhar o jogador como um quadrado
    });
}