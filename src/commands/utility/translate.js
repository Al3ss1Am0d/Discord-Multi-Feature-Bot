// src/commands/utility/translate.js
// Traduz texto (usa google-translate-api-x se disponível).

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

let translateFn = null;
try {
  const gt = require('google-translate-api-x');
  translateFn = (text, to) => gt.translate(text, { to });
} catch (_) {}

module.exports = {
  name: 'translate',
  category: 'utility',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Traduz um texto.')
    .addStringOption((opt) =>
      opt.setName('texto').setDescription('Texto a traduzir.').setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName('idioma')
        .setDescription('Código do idioma de destino (ex: en, pt, es).')
        .setRequired(false)
    ),

  async executePrefix(client, message, args) {
    if (!args.length) return message.reply('Informe o texto a traduzir. Ex: !translate en Olá mundo');
    const maybeLang = args[0];
    const to = /^[a-z]{2}$/i.test(maybeLang) ? maybeLang : 'en';
    const text = /^[a-z]{2}$/i.test(maybeLang) ? args.slice(1).join(' ') : args.join(' ');
    if (!text) return message.reply('Informe o texto a traduzir.');
    const result = await doTranslate(text, to);
    const embed = new EmbedBuilder()
      .setTitle('🌐 Tradução')
      .addFields(
        { name: 'Original', value: toTranslate.slice(0, 1000), inline: false },
        { name: 'Tradução', value: result.slice(0, 1000), inline: false }
      )
      .setColor(0x3498db);
    return message.reply({ embeds: [embed] });
  },

  async executeInteraction(client, interaction) {
    const text = interaction.options.getString('texto');
    const lang = interaction.options.getString('idioma') || 'en';
    const result = await doTranslate(text, lang);
    const embed = new EmbedBuilder()
      .setTitle('🌐 Tradução')
      .addFields(
        { name: 'Original', value: text.slice(0, 1000), inline: false },
        { name: 'Tradução', value: result.slice(0, 1000), inline: false }
      )
      .setColor(0x3498db);
    return interaction.reply({ embeds: [embed] });
  }
};

async function doTranslate(text, to) {
  if (!translateFn) return '(Módulo de tradução não instalado. Instale google-translate-api-x.)';
  try {
    const res = await translateFn(text, to);
    return res.text || String(res);
  } catch (e) {
    return `Erro ao traduzir: ${e.message}`;
  }
}
