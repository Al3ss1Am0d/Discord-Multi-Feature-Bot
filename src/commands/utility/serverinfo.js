// src/commands/utility/serverinfo.js
// Informações do servidor.

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'serverinfo',
  category: 'utility',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Mostra informações do servidor.'),

  async executePrefix(client, message, args) {
    if (!message.guild) return message.reply('Use em um servidor.');
    const embed = buildEmbed(message.guild);
    return message.reply({ embeds: [embed] });
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'Use em um servidor.', ephemeral: true });
    }
    const embed = buildEmbed(guild);
    return interaction.reply({ embeds: [embed] });
  }
};

function buildEmbed(guild) {
  const owner = guild.members.cache.get(guild.ownerId);
  return new EmbedBuilder()
    .setTitle(guild.name)
    .setThumbnail(guild.iconURL({ size: 256 }))
    .addFields(
      { name: 'ID', value: guild.id, inline: true },
      { name: 'Dono', value: owner?.user?.tag || guild.ownerId, inline: true },
      { name: 'Membros', value: String(guild.memberCount), inline: true },
      { name: 'Canais', value: String(guild.channels.cache.size), inline: true },
      { name: 'Cargos', value: String(guild.roles.cache.size), inline: true },
      { name: 'Criado em', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }
    )
    .setColor(0x5865f2);
}
