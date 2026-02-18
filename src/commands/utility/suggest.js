// src/commands/utility/suggest.js
// Envia uma sugestão para um canal (configurável por guild ou usa o canal atual).

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'suggest',
  category: 'utility',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Envia uma sugestão para o servidor.')
    .addStringOption((opt) =>
      opt.setName('sugestão').setDescription('Sua sugestão.').setRequired(true)
    ),

  async executePrefix(client, message, args) {
    if (!message.guild) return message.reply('Use em um servidor.');
    const text = args.join(' ');
    if (!text) return message.reply('Escreva sua sugestão.');
    const embed = new EmbedBuilder()
      .setTitle('💡 Sugestão')
      .setDescription(text)
      .setColor(0x9b59b6)
      .setFooter({ text: `Por ${message.author.tag}` })
      .setTimestamp();
    const sent = await message.channel.send({ embeds: [embed] });
    await sent.react('👍');
    await sent.react('👎');
    await message.delete().catch(() => {});
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'Use em um servidor.', ephemeral: true });
    }
    const text = interaction.options.getString('sugestão');
    const embed = new EmbedBuilder()
      .setTitle('💡 Sugestão')
      .setDescription(text)
      .setColor(0x9b59b6)
      .setFooter({ text: `Por ${interaction.user.tag}` })
      .setTimestamp();
    await interaction.reply({ content: 'Sugestão enviada!', ephemeral: true });
    const sent = await interaction.channel.send({ embeds: [embed] });
    await sent.react('👍');
    await sent.react('👎');
  }
};
