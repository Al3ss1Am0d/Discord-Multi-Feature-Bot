// src/commands/utility/transcribe.js
// Transcrever áudio: em Discord, anexos de áudio precisam de API externa (ex: Whisper).
// Este comando mostra instruções ou placeholder; integração real requer API key.

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'transcribe',
  category: 'utility',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('transcribe')
    .setDescription('Transcreve áudio (anexe um arquivo de áudio ou use o menu de contexto na mensagem).'),

  async executePrefix(client, message, args) {
    const attachment = message.attachments.find((a) =>
      /\.(mp3|wav|ogg|m4a|webm)$/i.test(a.name)
    );
    if (!attachment) {
      return message.reply(
        'Anexe um arquivo de áudio (mp3, wav, ogg, m4a) ou use o menu de contexto "Apps" em uma mensagem com áudio.'
      );
    }
    const embed = new EmbedBuilder()
      .setTitle('🎤 Transcrever áudio')
      .setDescription(
        'Para transcrever este áudio, configure uma API de transcrição (ex: OpenAI Whisper) no bot.\nArquivo: ' +
          attachment.url
      )
      .setColor(0x3498db);
    return message.reply({ embeds: [embed] });
  },

  async executeInteraction(client, interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🎤 Transcrever áudio')
      .setDescription(
        'Envie uma mensagem com um anexo de áudio ou use o menu de contexto (clique com botão direito na mensagem > Apps) em uma mensagem que contenha áudio.'
      )
      .setColor(0x3498db);
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
