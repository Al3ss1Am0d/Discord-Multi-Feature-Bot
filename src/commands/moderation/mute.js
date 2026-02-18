// src/commands/moderation/mute.js
// Aplica timeout (mute) em um usuário.

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { logEvent } = require('../../utils/logChannel');
const db = require('../../db');

const MAX_TIMEOUT_MS = 28 * 24 * 60 * 60 * 1000; // 28 dias (limite do Discord)

module.exports = {
  name: 'mute',
  category: 'moderation',
  permissionLevel: 'mod',
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Silencia um usuário por um tempo (timeout).')
    .addUserOption((opt) =>
      opt.setName('usuário').setDescription('Usuário a ser silenciado.').setRequired(true)
    )
    .addIntegerOption((opt) =>
      opt
        .setName('minutos')
        .setDescription('Duração em minutos.')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(40320)
    )
    .addStringOption((opt) =>
      opt.setName('motivo').setDescription('Motivo do mute.').setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async executePrefix(client, message, args) {
    if (!message.guild) return;
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply('Você não tem permissão para silenciar membros.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] && (await message.guild.members.fetch(args[0]).catch(() => null)));
    if (!target) return message.reply('Usuário não encontrado.');

    const minutes = parseInt(args[1], 10) || 10;
    const reason = args.slice(2).join(' ') || 'Sem motivo';

    await doMute(client, message.guild, message.member, target, minutes, reason, message.channel);
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({
        content: 'Este comando só funciona em servidores.',
        ephemeral: true
      });
    }

    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({
        content: 'Você não tem permissão para silenciar membros.',
        ephemeral: true
      });
    }

    const target = interaction.options.getMember('usuário');
    if (!target) {
      return interaction.reply({ content: 'Usuário não encontrado.', ephemeral: true });
    }

    const minutes = interaction.options.getInteger('minutos');
    const reason = interaction.options.getString('motivo') || 'Sem motivo';

    await interaction.deferReply({ ephemeral: true });
    await doMute(client, guild, interaction.member, target, minutes, reason, interaction.channel);
    await interaction.editReply(
      `✅ ${target.user.tag} foi silenciado por ${minutes} minuto(s). Motivo: ${reason}`
    );
  }
};

async function doMute(client, guild, moderator, target, minutes, reason, channel) {
  if (!target.moderatable) {
    return channel.send('Não consigo silenciar esse usuário.').catch(() => {});
  }

  const ms = Math.min(minutes * 60 * 1000, MAX_TIMEOUT_MS);
  await target.timeout(ms, reason).catch(() => {});

  db.prepare(
    `INSERT INTO moderation_logs (guild_id, user_id, moderator_id, action, reason, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(guild.id, target.id, moderator.id, 'mute', `${minutes}min: ${reason}`, Date.now());

  await logEvent(client, guild, '🔇 Usuário silenciado', {
    description: `Usuário: ${target.user.tag} (${target.id})\nModerador: ${moderator.user.tag}\nDuração: ${minutes} min\nMotivo: ${reason}`,
    color: 0xffaa00,
    type: 'mod'
  });
}
