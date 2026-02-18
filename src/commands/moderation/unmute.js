// src/commands/moderation/unmute.js
// Remove o timeout (mute) de um usuário.

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { logEvent } = require('../../utils/logChannel');
const db = require('../../db');

module.exports = {
  name: 'unmute',
  category: 'moderation',
  permissionLevel: 'mod',
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove o silenciamento de um usuário.')
    .addUserOption((opt) =>
      opt.setName('usuário').setDescription('Usuário a ser desmutado.').setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName('motivo').setDescription('Motivo (opcional).').setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async executePrefix(client, message, args) {
    if (!message.guild) return;
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply('Você não tem permissão para desmutar membros.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] && (await message.guild.members.fetch(args[0]).catch(() => null)));
    if (!target) return message.reply('Usuário não encontrado.');

    const reason = args.slice(1).join(' ') || 'Sem motivo';
    await doUnmute(client, message.guild, message.member, target, reason, message.channel);
    await message.reply(`✅ ${target.user.tag} foi desmutado.`);
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
        content: 'Você não tem permissão para desmutar membros.',
        ephemeral: true
      });
    }

    const target = interaction.options.getMember('usuário');
    if (!target) {
      return interaction.reply({ content: 'Usuário não encontrado.', ephemeral: true });
    }

    const reason = interaction.options.getString('motivo') || 'Sem motivo';

    await interaction.deferReply({ ephemeral: true });
    await doUnmute(client, guild, interaction.member, target, reason, interaction.channel);
    await interaction.editReply(`✅ ${target.user.tag} foi desmutado.`);
  }
};

async function doUnmute(client, guild, moderator, target, reason, channel) {
  if (!target.moderatable) {
    return channel.send('Não consigo desmutar esse usuário.').catch(() => {});
  }

  await target.timeout(null).catch(() => {});

  db.prepare(
    `INSERT INTO moderation_logs (guild_id, user_id, moderator_id, action, reason, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(guild.id, target.id, moderator.id, 'unmute', reason, Date.now());

  await logEvent(client, guild, '🔊 Usuário desmutado', {
    description: `Usuário: ${target.user.tag} (${target.id})\nModerador: ${moderator.user.tag}\nMotivo: ${reason}`,
    color: 0x00ff88,
    type: 'mod'
  });
}
