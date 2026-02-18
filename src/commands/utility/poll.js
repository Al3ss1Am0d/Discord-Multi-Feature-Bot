// src/commands/utility/poll.js
// Cria uma enquete com reações (sim/não ou opções).

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const YES = '✅';
const NO = '❌';

module.exports = {
  name: 'poll',
  category: 'utility',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Cria uma enquete no canal.')
    .addStringOption((opt) =>
      opt.setName('pergunta').setDescription('Pergunta da enquete.').setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName('opção1').setDescription('Opção 1 (opcional).').setRequired(false)
    )
    .addStringOption((opt) =>
      opt.setName('opção2').setDescription('Opção 2 (opcional).').setRequired(false)
    ),

  async executePrefix(client, message, args) {
    if (!message.guild) return message.reply('Use em um servidor.');
    const question = args.join(' ') || 'Enquete';
    const embed = new EmbedBuilder()
      .setTitle('📊 Enquete')
      .setDescription(question)
      .setColor(0x5865f2)
      .setFooter({ text: `Por ${message.author.tag}` });
    const sent = await message.channel.send({ embeds: [embed] });
    await sent.react(YES);
    await sent.react(NO);
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'Use em um servidor.', ephemeral: true });
    }
    const question = interaction.options.getString('pergunta');
    const opt1 = interaction.options.getString('opção1');
    const opt2 = interaction.options.getString('opção2');

    const embed = new EmbedBuilder()
      .setTitle('📊 Enquete')
      .setDescription(question)
      .setColor(0x5865f2)
      .setFooter({ text: `Por ${interaction.user.tag}` });

    if (opt1) embed.addFields({ name: '1️⃣', value: opt1, inline: true });
    if (opt2) embed.addFields({ name: '2️⃣', value: opt2, inline: true });

    await interaction.reply({ embeds: [embed], fetchReply: true }).then(async (sent) => {
      await sent.react(YES);
      await sent.react(NO);
    });
  }
};
