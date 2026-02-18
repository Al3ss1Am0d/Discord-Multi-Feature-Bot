// src/context/reminderMessage.js
// Menu de contexto: Criar lembrete a partir de uma mensagem.

const { ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const db = require('../db');

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

module.exports = {
  data: {
    type: ApplicationCommandType.Message,
    name: 'Criar lembrete'
  },
  async execute(client, interaction) {
    const message = interaction.targetMessage;
    const defaultText = message.content?.slice(0, 100) || 'Lembrete';

    const modal = new ModalBuilder()
      .setCustomId('reminder_modal:' + message.id)
      .setTitle('Lembrete');

    const timeInput = new TextInputBuilder()
      .setCustomId('time')
      .setLabel('Tempo (ex: 10m, 1h, 2d)')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('5m')
      .setRequired(true);

    const msgInput = new TextInputBuilder()
      .setCustomId('msg')
      .setLabel('Mensagem do lembrete')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder(defaultText)
      .setValue(defaultText)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(timeInput),
      new ActionRowBuilder().addComponents(msgInput)
    );

    await interaction.showModal(modal);

    const filter = (i) => i.customId.startsWith('reminder_modal:') && i.user.id === interaction.user.id;
    const submitted = await interaction.channel.awaitModalSubmit({ filter, time: 60000 }).catch(() => null);
    if (!submitted) return;

    const timeStr = submitted.fields.getTextInputValue('time').trim();
    const msg = submitted.fields.getTextInputValue('msg').trim() || defaultText;
    const ms = parseTime(timeStr);
    if (!ms || ms < 60000) {
      return submitted.reply({ content: 'Tempo inválido. Use ex: 5m, 1h, 1d (mínimo 1 minuto).', ephemeral: true });
    }
    const remindAt = Date.now() + ms;
    const guildId = submitted.guildId || null;
    const channelId = submitted.channelId;

    db.prepare(
      'INSERT INTO reminders (user_id, guild_id, channel_id, message, remind_at, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(submitted.user.id, guildId, channelId, msg, remindAt, Date.now());

    await submitted.reply({
      content: `⏰ Lembrete agendado para **${timeStr}**: ${msg.slice(0, 100)}`,
      ephemeral: true
    });
  }
};
