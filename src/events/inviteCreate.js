// src/events/inviteCreate.js

const { logEvent } = require('../utils/logChannel');

module.exports = {
  name: 'inviteCreate',
  async execute(client, invite) {
    await logEvent(client, invite.guild, '🔗 Convite criado', {
      description: `Link: ${invite.url} | Criado por: ${invite.inviter?.tag || 'N/A'}`
    });
  }
};

