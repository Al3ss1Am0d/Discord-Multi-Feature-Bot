// src/commands/economy/balance.js
// Mostra o saldo do usuário ou de outro membro.

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const economy = require('../../utils/economy');

module.exports = {
  name: 'balance',
  category: 'economy',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Mostra seu saldo ou o de outro usuário.')
    .addUserOption((opt) =>
      opt.setName('usuário').setDescription('Usuário para ver o saldo.').setRequired(false)
    ),

  async executePrefix(client, message, args) {
    if (!message.guild) return message.reply('Use este comando em um servidor.');
    const target = message.mentions.users.first() || (args[0] && await client.users.fetch(args[0]).catch(() => null)) || message.author;
    const guildId = message.guild.id;
    const balance = economy.getBalance(target.id, guildId);
    const embed = new EmbedBuilder()
      .setTitle('💰 Saldo')
      .setDescription(`${target.tag}: **${balance}** moedas`)
      .setColor(0xf1c40f);
    return message.reply({ embeds: [embed] });
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'Use este comando em um servidor.', ephemeral: true });
    }
    const target = interaction.options.getUser('usuário') || interaction.user;
    const balance = economy.getBalance(target.id, guild.id);
    const embed = new EmbedBuilder()
      .setTitle('💰 Saldo')
      .setDescription(`${target.tag}: **${balance}** moedas`)
      .setColor(0xf1c40f);
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
