// src/commands/economy/leaderboard.js
// Ranking de economia do servidor.

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const economy = require('../../utils/economy');

module.exports = {
  name: 'leaderboard',
  category: 'economy',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Ranking dos mais ricos do servidor.')
    .addIntegerOption((opt) =>
      opt
        .setName('top')
        .setDescription('Quantidade no ranking (padrão 10).')
        .setRequired(false)
        .setMinValue(5)
        .setMaxValue(25)
    ),

  async executePrefix(client, message, args) {
    if (!message.guild) return message.reply('Use este comando em um servidor.');
    const top = parseInt(args[0], 10) || 10;
    const rows = economy.getLeaderboard(message.guild.id, Math.min(top, 25));
    const embed = await buildLeaderboardEmbed(client, message.guild, rows);
    return message.reply({ embeds: [embed] });
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'Use este comando em um servidor.', ephemeral: true });
    }
    const top = interaction.options.getInteger('top') || 10;
    const rows = economy.getLeaderboard(guild.id, Math.min(top, 25));
    const embed = await buildLeaderboardEmbed(client, guild, rows);
    return interaction.reply({ embeds: [embed] });
  }
};

async function buildLeaderboardEmbed(client, guild, rows) {
  const lines = [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    let tag = 'Unknown';
    try {
      const user = await client.users.fetch(r.user_id).catch(() => null);
      tag = user ? user.tag : r.user_id;
    } catch {}
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
    lines.push(`${medal} ${tag} — **${r.balance}** moedas`);
  }
  const body = lines.length === 0 ? 'Ninguém no ranking ainda.' : lines.join('\n');
  return new EmbedBuilder()
    .setTitle('🏆 Leaderboard')
    .setDescription(body)
    .setColor(0xf1c40f);
}
