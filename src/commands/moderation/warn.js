// src/commands/moderation/warn.js
// Registra um aviso contra um usuário (sem punição automática).

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { logEvent } = require('../../utils/logChannel');
const db = require('../../db');

module.exports = {
  name: 'warn',
  category: 'moderation',
  permissionLevel: 'mod',
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Avisa um usuário e registra no log de moderação.')
    .addUserOption((opt) =>
      opt.setName('usuário').setDescription('Usuário a ser avisado.').setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName('motivo').setDescription('Motivo do aviso.').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async executePrefix(client, message, args) {
    if (!message.guild) return;
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply('Você não tem permissão para avisar membros.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] && (await message.guild.members.fetch(args[0]).catch(() => null)));
    if (!target) return message.reply('Usuário não encontrado.');

    const reason = args.slice(1).join(' ') || 'Sem motivo';
    await doWarn(client, message.guild, message.member, target, reason, message.channel);
    await message.reply(`✅ Aviso registrado para ${target.user.tag}.`);
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
        content: 'Você não tem permissão para avisar membros.',
        ephemeral: true
      });
    }

    const target = interaction.options.getMember('usuário');
    if (!target) {
      return interaction.reply({ content: 'Usuário não encontrado.', ephemeral: true });
    }

    const reason = interaction.options.getString('motivo') || 'Sem motivo';

    await interaction.deferReply({ ephemeral: true });
    await doWarn(client, guild, interaction.member, target, reason, interaction.channel);
    await interaction.editReply(`✅ Aviso registrado para ${target.user.tag}.`);
  }
};

async function doWarn(client, guild, moderator, target, reason, channel) {
  db.prepare(
    `INSERT INTO moderation_logs (guild_id, user_id, moderator_id, action, reason, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(guild.id, target.id, moderator.id, 'warn', reason, Date.now());

  await logEvent(client, guild, '⚠️ Aviso registrado', {
    description: `Usuário: ${target.user.tag} (${target.id})\nModerador: ${moderator.user.tag}\nMotivo: ${reason}`,
    color: 0xffcc00,
    type: 'mod'
  });

  await target
    .send(`Você recebeu um aviso em **${guild.name}**. Motivo: ${reason}`)
    .catch(() => {});
}
