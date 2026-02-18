// src/commands/music/resume.js

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'resume',
  category: 'music',
  permissionLevel: 'user',
  data: new SlashCommandBuilder().setName('resume').setDescription('Retoma a música pausada.'),

  async executePrefix(client, message, args) {
    if (!message.guild) return message.reply('Use em um servidor.');
    const ok = client.music.resume(message.guild.id);
    return message.reply(ok ? '▶️ Retomando.' : 'Nada pausado.');
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) return interaction.reply({ content: 'Use em um servidor.', ephemeral: true });
    const ok = client.music.resume(guild.id);
    return interaction.reply({
      content: ok ? '▶️ Retomando.' : 'Nada pausado.',
      ephemeral: true
    });
  }
};
