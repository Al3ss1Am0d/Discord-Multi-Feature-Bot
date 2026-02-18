// src/events/emojiCreate.js

const { logEvent } = require('../utils/logChannel');

module.exports = {
  name: 'emojiCreate',
  async execute(client, emoji) {
    await logEvent(client, emoji.guild, '😄 Emoji criado', {
      description: `${emoji.name} (${emoji.id})`
    });
  }
};

