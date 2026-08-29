const express = require('express');
const path = require('path');
const cors = require('cors');
const config = require('../config/default');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: config.maxPayloadSize }));
  app.use(express.static(path.join(__dirname, '../public')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  return app;
}

module.exports = createApp;
