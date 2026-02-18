// src/utils/logChannel.js
// Helper para enviar logs para o canal configurado da guild.

const db = require('../db');
const { EmbedBuilder } = require('discord.js');

function getLogChannelId(guildId, type = 'log') {
  try {
    const row = db
      .prepare('SELECT log_channel_id, modlog_channel_id FROM guild_config WHERE guild_id = ?')
      .get(guildId);
    if (!row) return null;
    return type === 'mod' ? row.modlog_channel_id : row.log_channel_id;
  } catch {
    return null;
  }
}

async function logEvent(client, guild, title, { description, color = 0x2b2d31, type = 'log' } = {}) {
  if (!guild) return;
  const channelId = getLogChannelId(guild.id, type);
  if (!channelId) return;
  const channel = guild.channels.cache.get(channelId);
  if (!channel || !channel.isTextBased()) return;

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description || null)
    .setColor(color)
    .setTimestamp(Date.now());

  channel.send({ embeds: [embed] }).catch(() => {});
}

module.exports = { logEvent, getLogChannelId };

