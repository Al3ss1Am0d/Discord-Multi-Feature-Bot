// src/client.js
// Client customizado para centralizar coleções, DB, logger, etc.

const { Client, Collection } = require('discord.js');
const db = require('./db');
const logger = require('./utils/logger');
const { createMusicManager } = require('./utils/musicPlayer');

module.exports = function createBotClient(options) {
  const client = new Client(options);

  // Coleções de comandos prefixados, slash e context menu
  client.commands = new Collection();
  client.slashCommands = new Collection();
  client.contextCommands = new Collection();

  // DB e helpers
  client.db = db;

  // Gerenciador de música compartilhado
  client.music = createMusicManager(client);

  // Logger centralizado
  client.logger = logger;

  return client;
};

