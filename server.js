const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 1e7 // 10MB limit per l'invio di PDF e foto in chat
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('Nuovo client connesso:', socket.id);

  socket.on('register-user', (username) => {
    socket.username = username;
  });

  socket.on('chat-message', (data) => {
    io.emit('chat-message', data);
  });

  // Gestione Segnalazione WebRTC per Audio/Video
  socket.on('call-user', (data) => {
    socket.broadcast.emit('call-made', {
      offer: data.offer,
      socket: socket.id,
      isVideo: data.isVideo,
      username: data.username
    });
  });

  socket.on('make-answer', (data) => {
    socket.to(data.to).emit('answer-made', {
      socket: socket.id,
      answer: data.answer
    });
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.to).emit('ice-candidate', {
      candidate: data.candidate
    });
  });

  socket.on('end-call', () => {
    socket.broadcast.emit('call-ended');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnesso:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server N.M.A. attivo sulla porta ${PORT}`);
});
