// src/commands/music/pause.js

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'pause',
  category: 'music',
  permissionLevel: 'user',
  data: new SlashCommandBuilder().setName('pause').setDescription('Pausa a música.'),

  async executePrefix(client, message, args) {
    if (!message.guild) return message.reply('Use em um servidor.');
    const ok = client.music.pause(message.guild.id);
    return message.reply(ok ? '⏸️ Música pausada.' : 'Nenhuma música tocando.');
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) return interaction.reply({ content: 'Use em um servidor.', ephemeral: true });
    const ok = client.music.pause(guild.id);
    return interaction.reply({
      content: ok ? '⏸️ Música pausada.' : 'Nenhuma música tocando.',
      ephemeral: true
    });
  }
};
