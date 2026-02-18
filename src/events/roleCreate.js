// src/events/roleCreate.js

const { logEvent } = require('../utils/logChannel');

module.exports = {
  name: 'roleCreate',
  async execute(client, role) {
    await logEvent(client, role.guild, '📌 Cargo criado', {
      description: `${role.name} (${role.id})`
    });
  }
};

