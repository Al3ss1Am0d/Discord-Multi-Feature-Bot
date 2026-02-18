// src/events/webhooksUpdate.js

const { logEvent } = require('../utils/logChannel');

module.exports = {
  name: 'webhooksUpdate',
  async execute(client, channel) {
    if (!channel.guild) return;
    await logEvent(client, channel.guild, '🪝 Webhooks atualizados', {
      description: `Canal: ${channel.name} (${channel.id})`
    });
  }
};

