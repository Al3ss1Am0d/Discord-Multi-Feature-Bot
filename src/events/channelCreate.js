// src/events/channelCreate.js

const { logEvent } = require('../utils/logChannel');

module.exports = {
  name: 'channelCreate',
  async execute(client, channel) {
    if (!channel.guild) return;
    await logEvent(client, channel.guild, '📺 Canal criado', {
      description: `${channel.name} (${channel.id})`
    });
  }
};

