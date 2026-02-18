// src/events/warn.js
// Avisos do client.

module.exports = {
  name: 'warn',
  async execute(client, info) {
    client.logger.warn('WARN do client:', info);
  }
};

