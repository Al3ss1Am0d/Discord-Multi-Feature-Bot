// src/commands/utility/reminder.js
// Agenda um lembrete (verificação por setInterval no ready ou cron simples).

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
  name: 'reminder',
  category: 'utility',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('reminder')
    .setDescription('Cria um lembrete.')
    .addStringOption((opt) =>
      opt.setName('tempo').setDescription('Ex: 10m, 1h, 2d').setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName('mensagem').setDescription('O que lembrar.').setRequired(true)
    ),

  async executePrefix(client, message, args) {
    if (!message.guild) return message.reply('Use em um servidor.');
    const timeStr = args[0];
    const msg = args.slice(1).join(' ') || 'Lembrete!';
    const ms = parseTime(timeStr);
    if (!ms || ms < 60000) return message.reply('Use um tempo válido (ex: 5m, 1h, 1d). Mínimo 1 minuto.');
    const remindAt = Date.now() + ms;
    db.prepare(
      'INSERT INTO reminders (user_id, guild_id, channel_id, message, remind_at, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(message.author.id, message.guild.id, message.channel.id, msg, remindAt, Date.now());
    const embed = new EmbedBuilder()
      .setTitle('⏰ Lembrete agendado')
      .setDescription(`Em ${timeStr}: ${msg}`)
      .setColor(0x9b59b6);
    return message.reply({ embeds: [embed] });
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'Use em um servidor.', ephemeral: true });
    }
    const timeStr = interaction.options.getString('tempo');
    const msg = interaction.options.getString('mensagem');
    const ms = parseTime(timeStr);
    if (!ms || ms < 60000) {
      return interaction.reply({
        content: 'Use um tempo válido (ex: 5m, 1h, 1d). Mínimo 1 minuto.',
        ephemeral: true
      });
    }
    const remindAt = Date.now() + ms;
    db.prepare(
      'INSERT INTO reminders (user_id, guild_id, channel_id, message, remind_at, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(interaction.user.id, guild.id, interaction.channel.id, msg, remindAt, Date.now());
    const embed = new EmbedBuilder()
      .setTitle('⏰ Lembrete agendado')
      .setDescription(`Em ${timeStr}: ${msg}`)
      .setColor(0x9b59b6);
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};

function parseTime(str) {
  const m = str && str.match(/^(\d+)(m|h|d)$/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  const u = (m[2] || '').toLowerCase();
  if (u === 'm') return n * 60 * 1000;
  if (u === 'h') return n * 60 * 60 * 1000;
  if (u === 'd') return n * 24 * 60 * 60 * 1000;
  return null;
}
