const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Setup Database JSON locale
const DB_FILE = './nma_database.json';
let db = { chat: [], logs: [] };

if (fs.existsSync(DB_FILE)) {
  db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

io.on('connection', (socket) => {
  console.log('Operatore connesso. Invio storico DB...');
  
  // Invia lo storico appena un client si connette
  socket.emit('history', db);

  // Gestione Chat
  socket.on('chat-message', (data) => {
    data.timestamp = new Date().toLocaleTimeString();
    db.chat.push(data);
    if (db.chat.length > 100) db.chat.shift(); // Mantieni ultimi 100
    saveDB();
    io.emit('chat-message', data);
  });

  // Gestione Event Logs / Allarmi
  socket.on('system-log', (logEntry) => {
    db.logs.push(logEntry);
    if (db.logs.length > 200) db.logs.shift(); // Mantieni ultimi 200
    saveDB();
    socket.broadcast.emit('system-log', logEntry); // Invia agli altri
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`N.M.A. SCADA Server attivo su porta ${PORT} con Database persistente.`);
});
