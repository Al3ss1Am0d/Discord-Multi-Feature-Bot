// src/commands/utility/ping.js
// Comando simples de ping (prefix + slash) usando i18n.

const { SlashCommandBuilder } = require('discord.js');
const { t } = require('../../i18n');

module.exports = {
  name: 'ping',
  category: 'utility',
  permissionLevel: 'user',
  data: new SlashCommandBuilder().setName('ping').setDescription('Mostra a latência do bot.'),

  /**
   * Comando com prefixo: !ping
   */
  async executePrefix(client, message) {
    const sent = await message.reply('Pong...');
    const ms = sent.createdTimestamp - message.createdTimestamp;
    await sent.edit(t(message.guild.id, 'commands.ping.reply', { ms }));
  },

  /**
   * Slash command: /ping
   */
  async executeInteraction(client, interaction) {
    const now = Date.now();
    await interaction.reply('Pong...');
    const ms = Date.now() - now;
    await interaction.editReply(
      t(interaction.guildId, 'commands.ping.reply', {
        ms
      })
    );
  }
};

