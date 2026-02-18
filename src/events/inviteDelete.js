// src/events/inviteDelete.js

const { logEvent } = require('../utils/logChannel');

module.exports = {
  name: 'inviteDelete',
  async execute(client, invite) {
    await logEvent(client, invite.guild, '🗑️ Convite removido', {
      description: `Código: ${invite.code}`
    });
  }
};

