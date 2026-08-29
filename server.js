const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Configurazione Socket.IO con CORS aperto per abilitare i client Mobile / HTTPS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Servizio dei file statici (gestisce sia 'public' che 'src/public')
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src/public')));

app.get('*', (req, res) => {
  const publicPath = path.join(__dirname, 'public', 'index.html');
  const srcPublicPath = path.join(__dirname, 'src/public', 'index.html');
  
  const fs = require('fs');
  if (fs.existsSync(publicPath)) {
    res.sendFile(publicPath);
  } else if (fs.existsSync(srcPublicPath)) {
    res.sendFile(srcPublicPath);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log(`[CONNECT] Nuovo dispositivo connesso: ${socket.id}`);

  // Registrazione utente
  socket.on('register-user', (username) => {
    activeUsers.set(socket.id, username);
    console.log(`[USER] Socket ${socket.id} registrato come: ${username}`);
  });

  // Gestione Messaggi Chat & Allegati
  socket.on('chat-message', (data) => {
    io.emit('chat-message', data);
  });

  // Signal WebRTC: Chiamata in arrivo
  socket.on('call-user', (data) => {
    console.log(`[WEBRTC] Chiamata avviata da ${socket.id} (${data.username})`);
    // Invia l'offerta di chiamata a tutti gli altri client connessi
    socket.broadcast.emit('call-made', {
      offer: data.offer,
      isVideo: data.isVideo,
      username: data.username,
      socket: socket.id
    });
  });

  // Signal WebRTC: Risposta alla chiamata
  socket.on('make-answer', (data) => {
    console.log(`[WEBRTC] Risposta inviata a target ${data.to}`);
    io.to(data.to).emit('answer-made', {
      answer: data.answer,
      socket: socket.id
    });
  });

  // Signal WebRTC: Scambio ICE Candidate (Fondamentale per la connessione P2P/STUN)
  socket.on('ice-candidate', (data) => {
    if (data.to) {
      io.to(data.to).emit('ice-candidate', {
        candidate: data.candidate,
        socket: socket.id
      });
    } else {
      socket.broadcast.emit('ice-candidate', {
        candidate: data.candidate,
        socket: socket.id
      });
    }
  });

  // Signal WebRTC: Chiusura Chiamata
  socket.on('end-call', () => {
    socket.broadcast.emit('call-ended');
  });

  // Disconnessione
  socket.on('disconnect', () => {
    console.log(`[DISCONNECT] Dispositivo disconnesso: ${socket.id}`);
    activeUsers.delete(socket.id);
    socket.broadcast.emit('call-ended');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`>>> N.M.A. SYSTEMS Server attivo sulla porta ${PORT}`);
});
