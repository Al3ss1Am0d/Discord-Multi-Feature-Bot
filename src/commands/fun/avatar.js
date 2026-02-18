// src/commands/fun/avatar.js
// Mostra o avatar de um usuário.

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'avatar',
  category: 'fun',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Mostra o avatar de um usuário.')
    .addUserOption((opt) =>
      opt.setName('usuário').setDescription('Usuário.').setRequired(false)
    ),

  async executePrefix(client, message, args) {
    const user =
      message.mentions.users.first() ||
      (args[0] && (await client.users.fetch(args[0]).catch(() => null))) ||
      message.author;
    const embed = new EmbedBuilder()
      .setTitle(`Avatar de ${user.tag}`)
      .setImage(user.displayAvatarURL({ size: 512, extension: 'png' }))
      .setColor(0x5865f2);
    return message.reply({ embeds: [embed] });
  },

  async executeInteraction(client, interaction) {
    const user = interaction.options.getUser('usuário') || interaction.user;
    const embed = new EmbedBuilder()
      .setTitle(`Avatar de ${user.tag}`)
      .setImage(user.displayAvatarURL({ size: 512, extension: 'png' }))
      .setColor(0x5865f2);
    return interaction.reply({ embeds: [embed] });
  }
};
