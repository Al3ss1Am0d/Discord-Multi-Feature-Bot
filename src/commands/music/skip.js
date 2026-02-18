// src/commands/music/skip.js

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'skip',
  category: 'music',
  permissionLevel: 'user',
  data: new SlashCommandBuilder().setName('skip').setDescription('Pula para a próxima música.'),

  async executePrefix(client, message, args) {
    if (!message.guild) return message.reply('Use em um servidor.');
    const ok = client.music.skip(message.guild.id);
    return message.reply(ok ? '⏭️ Pulando.' : 'Fila vazia.');
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) return interaction.reply({ content: 'Use em um servidor.', ephemeral: true });
    const ok = client.music.skip(guild.id);
    return interaction.reply({
      content: ok ? '⏭️ Pulando.' : 'Fila vazia.',
      ephemeral: true
    });
  }
};
