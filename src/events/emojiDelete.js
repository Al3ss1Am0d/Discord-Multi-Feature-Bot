// src/events/emojiDelete.js

const { logEvent } = require('../utils/logChannel');

module.exports = {
  name: 'emojiDelete',
  async execute(client, emoji) {
    await logEvent(client, emoji.guild, '🗑️ Emoji removido', {
      description: `${emoji.name} (${emoji.id})`
    });
  }
};

