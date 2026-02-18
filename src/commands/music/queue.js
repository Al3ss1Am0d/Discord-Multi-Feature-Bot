// src/commands/music/queue.js

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'queue',
  category: 'music',
  permissionLevel: 'user',
  data: new SlashCommandBuilder().setName('queue').setDescription('Mostra a fila de músicas.'),

  async executePrefix(client, message, args) {
    if (!message.guild) return message.reply('Use em um servidor.');
    const queue = client.music.getQueue(message.guild.id);
    const embed = buildQueueEmbed(queue);
    return message.reply({ embeds: [embed] });
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) return interaction.reply({ content: 'Use em um servidor.', ephemeral: true });
    const queue = client.music.getQueue(guild.id);
    const embed = buildQueueEmbed(queue);
    return interaction.reply({ embeds: [embed] });
  }
};

function buildQueueEmbed(queue) {
  if (!queue || !queue.songs || queue.songs.length === 0) {
    return new EmbedBuilder()
      .setTitle('🎵 Fila')
      .setDescription('Fila vazia.')
      .setColor(0x1db954);
  }
  const list = queue.songs
    .slice(0, 15)
    .map((s, i) => `${i + 1}. ${s.title}`)
    .join('\n');
  const current = queue.songs[0];
  return new EmbedBuilder()
    .setTitle('🎵 Fila')
    .setDescription(`**Tocando:** ${current?.title || '—'}\n\n${list}`)
    .setColor(0x1db954);
}
