const { Server } = require('socket.io');

function initSockets(server) {
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    maxHttpBufferSize: 1e7
  });

  const activeUsers = new Map();

  io.on('connection', (socket) => {
    socket.on('register-user', (username) => {
      activeUsers.set(socket.id, username || 'Operatore');
    });

    socket.on('chat-message', (data) => {
      io.emit('chat-message', {
        ...data,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('disconnect', () => {
      activeUsers.delete(socket.id);
    });
  });

  return io;
}

module.exports = { initSockets };
