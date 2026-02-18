// src/commands/fun/piada.js
// Conta uma piada aleatória (lista fixa).

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const JOKES = [
  { q: 'Por que o programador saiu de casa?', a: 'Porque ele já tinha bug.' },
  { q: 'Quantos programadores são necessários para trocar uma lâmpada?', a: 'Nenhum, é um problema de hardware.' },
  { q: 'O que um byte disse para o outro?', a: 'Nos vemos no bar (bus).' },
  { q: 'Por que o Java prefere usar óculos?', a: 'Porque não C#' },
  { q: 'Qual a bebida favorita do desenvolvedor?', a: 'Café. Sem ele não compila.' }
];

module.exports = {
  name: 'piada',
  category: 'fun',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('piada')
    .setDescription('Conta uma piada aleatória.'),

  async executePrefix(client, message, args) {
    const joke = JOKES[Math.floor(Math.random() * JOKES.length)];
    const embed = new EmbedBuilder()
      .setTitle('😂 Piada')
      .addFields(
        { name: 'Pergunta', value: joke.q, inline: false },
        { name: 'Resposta', value: joke.a, inline: false }
      )
      .setColor(0xf1c40f);
    return message.reply({ embeds: [embed] });
  },

  async executeInteraction(client, interaction) {
    const joke = JOKES[Math.floor(Math.random() * JOKES.length)];
    const embed = new EmbedBuilder()
      .setTitle('😂 Piada')
      .addFields(
        { name: 'Pergunta', value: joke.q, inline: false },
        { name: 'Resposta', value: joke.a, inline: false }
      )
      .setColor(0xf1c40f);
    return interaction.reply({ embeds: [embed] });
  }
};
