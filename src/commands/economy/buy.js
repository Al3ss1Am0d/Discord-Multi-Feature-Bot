// src/commands/economy/buy.js
// Compra um item da loja.

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../db');
const economy = require('../../utils/economy');

const SHOP_ITEMS = [
  { id: 'role_color', name: 'Cor do cargo', price: 5000, emoji: '🎨' },
  { id: 'double_daily', name: 'Daily em dobro (1x)', price: 2000, emoji: '📅' },
  { id: 'lucky_coin', name: 'Moeda da sorte', price: 1500, emoji: '🪙' },
  { id: 'shield', name: 'Escudo anti-advertência', price: 3000, emoji: '🛡️' },
  { id: 'cookie', name: 'Cookie especial', price: 100, emoji: '🍪' }
];

module.exports = {
  name: 'buy',
  category: 'economy',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Compra um item da loja.')
    .addStringOption((opt) =>
      opt
        .setName('item')
        .setDescription('ID do item (ex: cookie, role_color)')
        .setRequired(true)
    ),

  async executePrefix(client, message, args) {
    if (!message.guild) return message.reply('Use este comando em um servidor.');
    const itemId = (args[0] || '').toLowerCase();
    await doBuy(client, message.guild.id, message.author.id, itemId, message.reply.bind(message));
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'Use este comando em um servidor.', ephemeral: true });
    }
    const itemId = interaction.options.getString('item').toLowerCase();
    const reply = (content, opts = {}) =>
      interaction.reply({ ...opts, ephemeral: true, ...(typeof content === 'string' ? { content } : content) });
    await doBuy(client, guild.id, interaction.user.id, itemId, reply);
  }
};

async function doBuy(client, guildId, userId, itemId, reply) {
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item) {
    return reply(`Item \`${itemId}\` não encontrado. Use \`/shop\` para ver a lista.`);
  }

  const balance = economy.getBalance(userId, guildId);
  if (balance < item.price) {
    return reply(`Saldo insuficiente. Você tem **${balance}** moedas; o item custa **${item.price}**.`);
  }

  economy.addBalance(userId, guildId, -item.price);
  db.prepare(
    'INSERT INTO economy_inventory (user_id, guild_id, item_id, item_name, created_at) VALUES (?, ?, ?, ?, ?)'
  ).run(userId, guildId, item.id, item.name, Date.now());

  const embed = new EmbedBuilder()
    .setTitle('✅ Compra realizada')
    .setDescription(`${item.emoji} Você comprou **${item.name}** por ${item.price} moedas.`)
    .setColor(0x2ecc71);
  return reply({ embeds: [embed] });
}
