// src/commands/moderation/clear.js
// Apaga uma quantidade de mensagens no canal.

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const MAX_BULK = 100;

module.exports = {
  name: 'clear',
  category: 'moderation',
  permissionLevel: 'mod',
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Apaga mensagens no canal.')
    .addIntegerOption((opt) =>
      opt
        .setName('quantidade')
        .setDescription('Número de mensagens a apagar (1-100).')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(MAX_BULK)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async executePrefix(client, message, args) {
    if (!message.guild) return;
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return message.reply('Você não tem permissão para gerenciar mensagens.');
    }

    const amount = parseInt(args[0], 10) || 10;
    if (amount < 1 || amount > MAX_BULK) {
      return message.reply(`Informe um número entre 1 e ${MAX_BULK}.`);
    }

    await doClear(message.channel, amount, message);
    await message.reply(`✅ ${amount} mensagem(ns) apagada(s).`).then((m) => {
      setTimeout(() => m.delete().catch(() => {}), 3000);
    });
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({
        content: 'Este comando só funciona em servidores.',
        ephemeral: true
      });
    }

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: 'Você não tem permissão para gerenciar mensagens.',
        ephemeral: true
      });
    }

    const amount = interaction.options.getInteger('quantidade');

    await interaction.deferReply({ ephemeral: true });
    await doClear(interaction.channel, amount, null);
    await interaction.editReply(`✅ ${amount} mensagem(ns) apagada(s).`);
  }
};

async function doClear(channel, amount, message) {
  const toDelete = Math.min(amount + (message ? 1 : 0), MAX_BULK);
  const fetched = await channel.messages.fetch({ limit: toDelete });
  const filtered = message
    ? fetched.filter((m) => m.id !== message.id && !m.pinned)
    : fetched.filter((m) => !m.pinned);
  const toBulk = Array.from(filtered.values()).slice(0, amount);
  if (toBulk.length === 0) return;
  await channel.bulkDelete(toBulk, true).catch(() => {});
}
