// src/events/error.js
// Eventos globais de erro no client.

const { logEvent } = require('../utils/logChannel');

module.exports = {
  name: 'error',
  async execute(client, error) {
    client.logger.error('Erro no client:', error);
    // Não há guild específica aqui, então apenas logamos no console.
    // Erros específicos de guilds/comandos são tratados nos próprios handlers.
  }
};

