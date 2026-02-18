// src/handlers/eventLoader.js
// Carrega automaticamente todos os eventos da pasta src/events.

const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

async function loadEvents(client, eventsPath) {
  const files = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

  for (const file of files) {
    const event = require(path.join(eventsPath, file));

    // Cada arquivo de evento deve exportar: name, once (opcional) e execute(...)
    if (!event || !event.name || typeof event.execute !== 'function') {
      logger.warn(`Evento ignorado (falta name/execute): ${file}`);
      continue;
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args));
    }

    logger.info(`Evento carregado: ${event.name}`);
  }
}

module.exports = { loadEvents };

