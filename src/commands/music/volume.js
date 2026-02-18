// src/commands/music/volume.js

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'volume',
  category: 'music',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Ajusta o volume (0-100).')
    .addIntegerOption((opt) =>
      opt
        .setName('valor')
        .setDescription('Volume (0-100).')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(100)
    ),

  async executePrefix(client, message, args) {
    if (!message.guild) return message.reply('Use em um servidor.');
    const n = parseInt(args[0], 10);
    if (isNaN(n) || n < 0 || n > 100) return message.reply('Use um número entre 0 e 100.');
    const vol = n / 100;
    const ok = client.music.setVolume(message.guild.id, vol);
    return message.reply(ok ? `🔊 Volume: ${n}%` : 'Nenhuma música tocando.');
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) return interaction.reply({ content: 'Use em um servidor.', ephemeral: true });
    const n = interaction.options.getInteger('valor');
    const vol = n / 100;
    const ok = client.music.setVolume(guild.id, vol);
    return interaction.reply({
      content: ok ? `🔊 Volume: ${n}%` : 'Nenhuma música tocando.',
      ephemeral: true
    });
  }
};
