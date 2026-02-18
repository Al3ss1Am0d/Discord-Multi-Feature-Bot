// src/commands/fun/gif.js
// Busca um GIF (usa Tenor ou fallback; aqui fallback com Giphy placeholder ou link fixo).
// Para produção: use TENOR_API_KEY no .env e descomente a busca.

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

const FALLBACK_GIF = 'https://media.giphy.com/media/3o7TKSjRvbIPh5ffio/giphy.gif';

async function searchGif(query) {
  const key = process.env.TENOR_API_KEY;
  if (key) {
    try {
      const url = `https://g.tenor.com/v1/search?q=${encodeURIComponent(query)}&key=${key}&limit=1`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.results && data.results[0] && data.results[0].media && data.results[0].media[0]) {
        return data.results[0].media[0].gif.url;
      }
    } catch (e) {
      // fallback
    }
  }
  return FALLBACK_GIF;
}

module.exports = {
  name: 'gif',
  category: 'fun',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('gif')
    .setDescription('Busca um GIF.')
    .addStringOption((opt) =>
      opt.setName('busca').setDescription('O que procurar (ex: cat, dance).').setRequired(true)
    ),

  async executePrefix(client, message, args) {
    const query = args.join(' ') || 'fun';
    await message.channel.sendTyping?.();
    const gifUrl = await searchGif(query);
    const embed = new EmbedBuilder()
      .setTitle(`GIF: ${query}`)
      .setImage(gifUrl)
      .setColor(0xe91e63);
    return message.reply({ embeds: [embed] });
  },

  async executeInteraction(client, interaction) {
    const query = interaction.options.getString('busca') || 'fun';
    await interaction.deferReply();
    const gifUrl = await searchGif(query);
    const embed = new EmbedBuilder()
      .setTitle(`GIF: ${query}`)
      .setImage(gifUrl)
      .setColor(0xe91e63);
    return interaction.editReply({ embeds: [embed] });
  }
};
