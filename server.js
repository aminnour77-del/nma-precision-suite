const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const https = require('https');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const DB_FILE = './nma_database.json';
let db = { chat: [], logs: [] };

if (fs.existsSync(DB_FILE)) {
  try { db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch(e) {}
}

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Configurazione Telegram (Opzionale: inserisci i tuoi token se desideri notifiche reali)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

function sendTelegramAlert(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(message)}`;
  https.get(url, (res) => {}).on('error', (e) => {});
}

// Gestione Socket.IO
io.on('connection', (socket) => {
  socket.emit('history', db);

  socket.on('chat-message', (data) => {
    data.timestamp = new Date().toLocaleTimeString();
    db.chat.push(data);
    if (db.chat.length > 100) db.chat.shift();
    saveDB();
    io.emit('chat-message', data);
  });

  socket.on('system-log', (logEntry) => {
    db.logs.push(logEntry);
    if (db.logs.length > 200) db.logs.shift();
    saveDB();
    if (logEntry.isWarning) {
      sendTelegramAlert(`⚠️ [N.M.A. ALLARME SCADA]\nOrario: ${logEntry.time}\nEvento: ${logEntry.msg}`);
    }
    socket.broadcast.emit('system-log', logEntry);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`N.M.A. SCADA Server attivo su porta ${PORT}`);
});
