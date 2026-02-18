// src/context/transcribeMessage.js
// Menu de contexto: Transcrever áudio (mensagem com anexo de áudio).
// Integração real com Whisper/API fica por conta do projeto.

const { ApplicationCommandType } = require('discord.js');

module.exports = {
  data: {
    type: ApplicationCommandType.Message,
    name: 'Transcrever áudio'
  },
  async execute(client, interaction) {
    const message = interaction.targetMessage;
    const attachment = message.attachments?.find((a) =>
      /\.(mp3|wav|ogg|m4a|webm|opus)$/i.test(a.name)
    );
    if (!attachment) {
      return interaction.reply({
        content: 'Esta mensagem não contém um anexo de áudio. Anexe um arquivo de áudio (mp3, wav, ogg, etc.).',
        ephemeral: true
      });
    }
    await interaction.reply({
      content: `🎤 Para transcrever o áudio, configure uma API (ex: OpenAI Whisper) no bot.\nArquivo: ${attachment.url}`,
      ephemeral: true
    });
  }
};
