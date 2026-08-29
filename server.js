const http = require('http');
const config = require('./config/default');
const createApp = require('./src/app');
const { initSockets } = require('./src/sockets/chatSocket');

const app = createApp();
const server = http.createServer(app);

initSockets(server);

server.listen(config.port, () => {
  console.log(`[NMA SYSTEMS] Server Enterprise attivo sulla porta ${config.port}`);
});
