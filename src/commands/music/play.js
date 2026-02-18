// src/commands/music/play.js
// Adiciona uma música à fila e toca (YouTube ou busca).

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'play',
  category: 'music',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Toca uma música (YouTube ou nome).')
    .addStringOption((opt) =>
      opt.setName('busca').setDescription('URL do YouTube ou nome da música.').setRequired(true)
    ),

  async executePrefix(client, message, args) {
    if (!message.guild) return message.reply('Use em um servidor.');
    const voiceChannel = message.member?.voice?.channel;
    if (!voiceChannel) {
      return message.reply('Entre em um canal de voz primeiro.');
    }
    const query = args.join(' ');
    if (!query) return message.reply('Informe a música ou URL.');
    await doPlay(client, message.guild, voiceChannel.id, message.channel.id, query, message.author.tag, message.channel);
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'Use em um servidor.', ephemeral: true });
    }
    const voiceChannel = interaction.member?.voice?.channel;
    if (!voiceChannel) {
      return interaction.reply({
        content: 'Entre em um canal de voz primeiro.',
        ephemeral: true
      });
    }
    const query = interaction.options.getString('busca');
    await interaction.deferReply();
    try {
      const song = await client.music.addToQueue({
        guild,
        voiceChannelId: voiceChannel.id,
        textChannelId: interaction.channel.id,
        query,
        requestedBy: interaction.user.tag
      });
      const embed = new EmbedBuilder()
        .setTitle('🎵 Adicionado à fila')
        .setDescription(song ? song.title : query)
        .setColor(0x1db954);
      await interaction.editReply({ embeds: [embed] }).catch(() => {});
    } catch (err) {
      client.logger.error('Erro ao tocar:', err);
      await interaction.editReply('Não foi possível tocar essa música. Verifique a URL ou o nome.').catch(() => {});
    }
  }
};

async function doPlay(client, guild, voiceChannelId, textChannelId, query, requestedBy, channel) {
  try {
    const song = await client.music.addToQueue({
      guild,
      voiceChannelId,
      textChannelId,
      query,
      requestedBy
    });
    if (song && channel) {
      const embed = new EmbedBuilder()
        .setTitle('🎵 Tocando')
        .setDescription(song.title)
        .setColor(0x1db954);
      channel.send({ embeds: [embed] }).catch(() => {});
    }
  } catch (err) {
    client.logger.error('Erro ao tocar:', err);
    if (channel) channel.send('Não foi possível tocar essa música. Verifique a URL ou o nome.').catch(() => {});
  }
}
