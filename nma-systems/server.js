const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  socket.on('call-user', (data) => {
    socket.broadcast.emit('incoming-call', {
      from: socket.id,
      offer: data.offer,
      isVideo: data.isVideo,
      username: data.username || 'Operatore'
    });
  });

  socket.on('answer-call', (data) => {
    io.to(data.to).emit('call-answered', {
      from: socket.id,
      answer: data.answer
    });
  });

  socket.on('ice-candidate', (data) => {
    socket.broadcast.emit('ice-candidate', { candidate: data.candidate, from: socket.id });
  });

  socket.on('end-call', () => {
    socket.broadcast.emit('call-ended');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`NMA Server V2 attivo su porta ${PORT}`));
