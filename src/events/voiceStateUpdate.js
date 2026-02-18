// src/events/voiceStateUpdate.js
// Usado para auto-disconnect quando o bot fica sozinho no canal de voz.

const { logEvent } = require('../utils/logChannel');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(client, oldState, newState) {
    const guild = newState.guild || oldState.guild;
    const queue = client.music.getQueue(guild.id);
    if (queue && queue.voiceChannelId) {
      const channel = guild.channels.cache.get(queue.voiceChannelId);
      if (channel && channel.isVoiceBased()) {
        const nonBots = channel.members.filter((m) => !m.user.bot);
        if (nonBots.size === 0) {
          client.music.stop(guild.id);
          await logEvent(client, guild, '🔌 Auto-disconnect', {
            description: 'O bot saiu do canal de voz por estar sozinho.'
          });
        }
      }
    }
  }
};

