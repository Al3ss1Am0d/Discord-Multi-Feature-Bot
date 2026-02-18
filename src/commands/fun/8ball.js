// src/commands/fun/8ball.js
// Bola mágica 8.

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const RESPONSES = [
  'Sim.',
  'Não.',
  'Talvez.',
  'Com certeza!',
  'Nunca.',
  'Pergunte de novo mais tarde.',
  'Não conte com isso.',
  'Os sinais apontam que sim.',
  'Melhor não te dizer agora.',
  'Minhas fontes dizem não.',
  'Muito provável.',
  'Perspectiva boa.',
  'Sim, definitivamente.',
  'Concentre-se e pergunte de novo.',
  'Não é possível prever agora.'
];

module.exports = {
  name: '8ball',
  category: 'fun',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Pergunte à bola mágica.')
    .addStringOption((opt) =>
      opt.setName('pergunta').setDescription('Sua pergunta (sim/não).').setRequired(true)
    ),

  async executePrefix(client, message, args) {
    const question = args.join(' ') || 'nada?';
    const reply = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
    const embed = new EmbedBuilder()
      .setTitle('🔮 8ball')
      .addFields(
        { name: 'Pergunta', value: question, inline: false },
        { name: 'Resposta', value: reply, inline: false }
      )
      .setColor(0x9b59b6);
    return message.reply({ embeds: [embed] });
  },

  async executeInteraction(client, interaction) {
    const question = interaction.options.getString('pergunta');
    const reply = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
    const embed = new EmbedBuilder()
      .setTitle('🔮 8ball')
      .addFields(
        { name: 'Pergunta', value: question, inline: false },
        { name: 'Resposta', value: reply, inline: false }
      )
      .setColor(0x9b59b6);
    return interaction.reply({ embeds: [embed] });
  }
};
