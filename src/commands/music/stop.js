// src/commands/music/stop.js

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'stop',
  category: 'music',
  permissionLevel: 'user',
  data: new SlashCommandBuilder().setName('stop').setDescription('Para a música e limpa a fila.'),

  async executePrefix(client, message, args) {
    if (!message.guild) return message.reply('Use em um servidor.');
    client.music.stop(message.guild.id);
    return message.reply('🛑 Parado e fila limpa.');
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) return interaction.reply({ content: 'Use em um servidor.', ephemeral: true });
    client.music.stop(guild.id);
    return interaction.reply({ content: '🛑 Parado e fila limpa.', ephemeral: true });
  }
};
