// src/context/summarizeMessage.js
// Menu de contexto: Resumir texto (mensagem longa).
// Resumo simples por tamanho; para IA use API externa.

const { ApplicationCommandType } = require('discord.js');

module.exports = {
  data: {
    type: ApplicationCommandType.Message,
    name: 'Resumir texto'
  },
  async execute(client, interaction) {
    const message = interaction.targetMessage;
    const text = message.content?.slice(0, 4000) || message.embeds?.[0]?.description?.slice(0, 4000) || '';
    if (!text || text.length < 50) {
      return interaction.reply({
        content: 'Mensagem muito curta para resumir ou sem texto.',
        ephemeral: true
      });
    }
    // Resumo simples: primeiras frases + "..." (em produção use uma API de sumarização)
    const sentences = text.split(/(?<=[.!?])\s+/);
    const summary = sentences.slice(0, 3).join(' ').slice(0, 500) + (sentences.length > 3 ? '...' : '');
    await interaction.reply({
      content: `**Resumo:**\n${summary}`,
      ephemeral: true
    });
  }
};
