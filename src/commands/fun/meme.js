// src/commands/fun/meme.js
// Envia um meme (lista fixa ou API externa; aqui usamos lista para não depender de API).

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const MEMES = [
  { title: 'Debug', url: 'https://i.imgur.com/5Kz32vD.png', desc: 'Quando o código finalmente funciona.' },
  { title: 'Commit', url: 'https://i.imgur.com/4uRrqG2.png', desc: 'git commit -m "fix"' },
  { title: 'Documentação', url: 'https://i.imgur.com/3nRqY9x.png', desc: 'Quem precisa de docs?' },
  { title: 'Produção', url: 'https://i.imgur.com/2Kz32vD.png', desc: 'Funciona na minha máquina.' },
  { title: 'Reunião', url: 'https://i.imgur.com/1Kz32vD.png', desc: 'Could have been an email.' }
];

function randomMeme() {
  return MEMES[Math.floor(Math.random() * MEMES.length)];
}

module.exports = {
  name: 'meme',
  category: 'fun',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Envia um meme aleatório.'),

  async executePrefix(client, message, args) {
    const meme = randomMeme();
    const embed = new EmbedBuilder()
      .setTitle(meme.title)
      .setDescription(meme.desc)
      .setImage(meme.url)
      .setColor(0x5865f2);
    return message.reply({ embeds: [embed] });
  },

  async executeInteraction(client, interaction) {
    const meme = randomMeme();
    const embed = new EmbedBuilder()
      .setTitle(meme.title)
      .setDescription(meme.desc)
      .setImage(meme.url)
      .setColor(0x5865f2);
    return interaction.reply({ embeds: [embed] });
  }
};
