// src/context/translateMessage.js
// Menu de contexto: Traduzir mensagem (User Install Apps).

const { ApplicationCommandType } = require('discord.js');
let translateFn = null;
try {
  const gt = require('google-translate-api-x');
  translateFn = (text, to) => gt.translate(text, { to });
} catch (_) {}

module.exports = {
  data: {
    type: ApplicationCommandType.Message,
    name: 'Traduzir mensagem'
  },
  async execute(client, interaction) {
    const message = interaction.targetMessage;
    const text = message.content?.slice(0, 2000) || message.embeds?.[0]?.description?.slice(0, 2000) || '';
    if (!text) {
      return interaction.reply({ content: 'Esta mensagem não tem texto para traduzir.', ephemeral: true });
    }
    await interaction.deferReply({ ephemeral: true });
    const to = 'pt';
    try {
      const res = translateFn ? await translateFn(text, to) : null;
      const translated = res?.text || '(Configure google-translate-api-x para traduzir.)';
      return interaction.editReply({
        content: `**Tradução (${to}):**\n${translated.slice(0, 1900)}`
      });
    } catch (e) {
      return interaction.editReply({ content: `Erro: ${e.message}`, ephemeral: true });
    }
  }
};
