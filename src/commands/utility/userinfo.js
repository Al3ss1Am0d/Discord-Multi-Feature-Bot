// src/commands/utility/userinfo.js
// Informações de um usuário.

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'userinfo',
  category: 'utility',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Mostra informações de um usuário.')
    .addUserOption((opt) =>
      opt.setName('usuário').setDescription('Usuário.').setRequired(false)
    ),

  async executePrefix(client, message, args) {
    if (!message.guild) return message.reply('Use em um servidor.');
    const user =
      message.mentions.users.first() ||
      (args[0] && (await client.users.fetch(args[0]).catch(() => null))) ||
      message.author;
    const member = message.guild.members.cache.get(user.id) || await message.guild.members.fetch(user.id).catch(() => null);
    const embed = buildEmbed(user, member);
    return message.reply({ embeds: [embed] });
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'Use em um servidor.', ephemeral: true });
    }
    const user = interaction.options.getUser('usuário') || interaction.user;
    const member = guild.members.cache.get(user.id) || await guild.members.fetch(user.id).catch(() => null);
    const embed = buildEmbed(user, member);
    return interaction.reply({ embeds: [embed] });
  }
};

function buildEmbed(user, member) {
  const embed = new EmbedBuilder()
    .setTitle(user.tag)
    .setThumbnail(user.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: 'ID', value: user.id, inline: true },
      { name: 'Conta criada', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
    )
    .setColor(0x5865f2);

  if (member) {
    embed.addFields(
      { name: 'Entrou no servidor', value: member.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'N/A', inline: true },
      { name: 'Cargos', value: member.roles.cache.map((r) => r.name).filter((n) => n !== '@everyone').join(', ') || 'Nenhum', inline: false }
    );
  }
  return embed;
}
