// src/events/channelDelete.js

const { logEvent } = require('../utils/logChannel');

module.exports = {
  name: 'channelDelete',
  async execute(client, channel) {
    if (!channel.guild) return;
    await logEvent(client, channel.guild, '🗑️ Canal removido', {
      description: `${channel.name} (${channel.id})`
    });
  }
};

