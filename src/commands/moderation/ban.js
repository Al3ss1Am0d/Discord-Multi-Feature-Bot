// src/commands/moderation/ban.js
// Bane um usuário do servidor.

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { logEvent } = require('../../utils/logChannel');
const db = require('../../db');

module.exports = {
  name: 'ban',
  category: 'moderation',
  permissionLevel: 'mod',
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bane um usuário do servidor.')
    .addUserOption((opt) =>
      opt.setName('usuário').setDescription('Usuário a ser banido.').setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName('motivo').setDescription('Motivo do banimento.').setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async executePrefix(client, message, args) {
    if (!message.guild) return;
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply('Você não tem permissão para banir membros.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] && (await message.guild.members.fetch(args[0]).catch(() => null)));
    if (!target) return message.reply('Usuário não encontrado.');

    const reason = args.slice(1).join(' ') || 'Sem motivo';

    await doBan(client, message.guild, message.member, target, reason, message.channel);
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'Este comando só funciona em servidores.', ephemeral: true });
    }

    const member = interaction.member;
    if (!member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: 'Você não tem permissão para banir membros.',
        ephemeral: true
      });
    }

    const target = interaction.options.getMember('usuário');
    if (!target) {
      return interaction.reply({ content: 'Usuário não encontrado.', ephemeral: true });
    }

    const reason = interaction.options.getString('motivo') || 'Sem motivo';

    await interaction.deferReply({ ephemeral: true });
    await doBan(client, guild, member, target, reason, interaction.channel);
    await interaction.editReply(`✅ ${target.user.tag} foi banido. Motivo: ${reason}`);
  }
};

async function doBan(client, guild, moderator, target, reason, channel) {
  if (!target.bannable) {
    return channel.send('Não consigo banir esse usuário.').catch(() => {});
  }

  await target
    .send(`Você foi banido de **${guild.name}**. Motivo: ${reason}`)
    .catch(() => {});

  await target.ban({ reason }).catch(() => {});

  db.prepare(
    `INSERT INTO moderation_logs (guild_id, user_id, moderator_id, action, reason, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(guild.id, target.id, moderator.id, 'ban', reason, Date.now());

  await logEvent(client, guild, '⛔ Usuário banido', {
    description: `Usuário: ${target.user.tag} (${target.id})\nModerador: ${moderator.user.tag} (${moderator.id})\nMotivo: ${reason}`,
    color: 0xff0000,
    type: 'mod'
  });

  channel.send(`✅ ${target.user.tag} foi banido. Motivo: ${reason}`).catch(() => {});
}

