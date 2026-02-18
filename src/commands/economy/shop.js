// src/commands/economy/shop.js
// Lista itens à venda (itens fixos por simplicidade).

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const SHOP_ITEMS = [
  { id: 'role_color', name: 'Cor do cargo', price: 5000, emoji: '🎨' },
  { id: 'double_daily', name: 'Daily em dobro (1x)', price: 2000, emoji: '📅' },
  { id: 'lucky_coin', name: 'Moeda da sorte', price: 1500, emoji: '🪙' },
  { id: 'shield', name: 'Escudo anti-advertência', price: 3000, emoji: '🛡️' },
  { id: 'cookie', name: 'Cookie especial', price: 100, emoji: '🍪' }
];

module.exports = {
  name: 'shop',
  category: 'economy',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Abre a loja do servidor.'),

  async executePrefix(client, message, args) {
    if (!message.guild) return message.reply('Use este comando em um servidor.');
    const embed = buildShopEmbed();
    return message.reply({ embeds: [embed] });
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'Use este comando em um servidor.', ephemeral: true });
    }
    const embed = buildShopEmbed();
    return interaction.reply({ embeds: [embed] });
  }
};

function buildShopEmbed() {
  const list = SHOP_ITEMS.map(
    (i) => `${i.emoji} **${i.name}** — \`${i.id}\` — ${i.price} moedas`
  ).join('\n');
  return new EmbedBuilder()
    .setTitle('🛒 Loja')
    .setDescription('Use `/buy <id>` para comprar.\n\n' + list)
    .setColor(0x9b59b6)
    .setFooter({ text: 'Ex: /buy cookie' });
}
