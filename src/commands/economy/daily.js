// src/commands/economy/daily.js
// Recompensa diária de moedas.

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const economy = require('../../utils/economy');

function formatMs(ms) {
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000);
  return `${h}h ${m}m ${s}s`;
}

module.exports = {
  name: 'daily',
  category: 'economy',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Pega sua recompensa diária de moedas.'),

  async executePrefix(client, message, args) {
    if (!message.guild) return message.reply('Use este comando em um servidor.');
    const guildId = message.guild.id;
    const userId = message.author.id;
    const result = economy.claimDaily(userId, guildId);
    if (result.ok) {
      const embed = new EmbedBuilder()
        .setTitle('📅 Daily')
        .setDescription(`Você recebeu **${result.amount}** moedas!\nSaldo atual: **${result.balance}**`)
        .setColor(0x2ecc71);
      return message.reply({ embeds: [embed] });
    }
    const wait = formatMs(result.nextAt - Date.now());
    return message.reply(`⏳ Você já pegou o daily. Volte em **${wait}**.`);
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'Use este comando em um servidor.', ephemeral: true });
    }
    const result = economy.claimDaily(interaction.user.id, guild.id);
    if (result.ok) {
      const embed = new EmbedBuilder()
        .setTitle('📅 Daily')
        .setDescription(`Você recebeu **${result.amount}** moedas!\nSaldo atual: **${result.balance}**`)
        .setColor(0x2ecc71);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const wait = formatMs(result.nextAt - Date.now());
    return interaction.reply({
      content: `⏳ Você já pegou o daily. Volte em **${wait}**.`,
      ephemeral: true
    });
  }
};
