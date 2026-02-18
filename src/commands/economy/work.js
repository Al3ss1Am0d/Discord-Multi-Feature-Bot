// src/commands/economy/work.js
// Trabalhar para ganhar moedas (cooldown 1h).

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const economy = require('../../utils/economy');

function formatMs(ms) {
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000);
  return `${h}h ${m}m ${s}s`;
}

module.exports = {
  name: 'work',
  category: 'economy',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Trabalha para ganhar moedas (cooldown de 1 hora).'),

  async executePrefix(client, message, args) {
    if (!message.guild) return message.reply('Use este comando em um servidor.');
    const guildId = message.guild.id;
    const userId = message.author.id;
    const result = economy.claimWork(userId, guildId);
    if (result.ok) {
      const embed = new EmbedBuilder()
        .setTitle('💼 Work')
        .setDescription(`Você ganhou **${result.amount}** moedas!\nSaldo atual: **${result.balance}**`)
        .setColor(0x3498db);
      return message.reply({ embeds: [embed] });
    }
    const wait = formatMs(result.nextAt - Date.now());
    return message.reply(`⏳ Descanse um pouco. Volte em **${wait}**.`);
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'Use este comando em um servidor.', ephemeral: true });
    }
    const result = economy.claimWork(interaction.user.id, guild.id);
    if (result.ok) {
      const embed = new EmbedBuilder()
        .setTitle('💼 Work')
        .setDescription(`Você ganhou **${result.amount}** moedas!\nSaldo atual: **${result.balance}**`)
        .setColor(0x3498db);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const wait = formatMs(result.nextAt - Date.now());
    return interaction.reply({
      content: `⏳ Descanse um pouco. Volte em **${wait}**.`,
      ephemeral: true
    });
  }
};
