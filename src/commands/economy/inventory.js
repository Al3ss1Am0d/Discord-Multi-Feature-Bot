// src/commands/economy/inventory.js
// Mostra o inventário do usuário.

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
  name: 'inventory',
  category: 'economy',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('Mostra seus itens comprados.')
    .addUserOption((opt) =>
      opt.setName('usuário').setDescription('Ver inventário de outro usuário.').setRequired(false)
    ),

  async executePrefix(client, message, args) {
    if (!message.guild) return message.reply('Use este comando em um servidor.');
    const target = message.mentions.users.first() || message.author;
    const items = getInventory(target.id, message.guild.id);
    const embed = buildInventoryEmbed(target.tag, items);
    return message.reply({ embeds: [embed] });
  },

  async executeInteraction(client, interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'Use este comando em um servidor.', ephemeral: true });
    }
    const target = interaction.options.getUser('usuário') || interaction.user;
    const items = getInventory(target.id, guild.id);
    const embed = buildInventoryEmbed(target.tag, items);
    return interaction.reply({ embeds: [embed] });
  }
};

function getInventory(userId, guildId) {
  return db
    .prepare(
      'SELECT item_id, item_name, created_at FROM economy_inventory WHERE user_id = ? AND guild_id = ? ORDER BY created_at DESC'
    )
    .all(userId, guildId);
}

function buildInventoryEmbed(userTag, items) {
  const list =
    items.length === 0
      ? 'Nenhum item.'
      : items.map((i) => `• **${i.item_name}** (\`${i.item_id}\`)`).join('\n');
  return new EmbedBuilder()
    .setTitle(`🎒 Inventário de ${userTag}`)
    .setDescription(list)
    .setColor(0xe67e22);
}
