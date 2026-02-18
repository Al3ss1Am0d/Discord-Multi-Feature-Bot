// src/events\roleDelete.js

const { logEvent } = require('../utils/logChannel');

module.exports = {
  name: 'roleDelete',
  async execute(client, role) {
    await logEvent(client, role.guild, '🗑️ Cargo removido', {
      description: `${role.name} (${role.id})`
    });
  }
};

