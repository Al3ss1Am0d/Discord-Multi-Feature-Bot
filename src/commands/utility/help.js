// src/commands/utility/help.js
// Sistema de ajuda que lista comandos por categoria.

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { t } = require('../../i18n');
const config = require('../../utils/config');

module.exports = {
  name: 'help',
  category: 'utility',
  permissionLevel: 'user',
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Mostra a lista de comandos.')
    .addStringOption((opt) =>
      opt.setName('comando').setDescription('Nome de um comando específico.').setRequired(false)
    ),

  async executePrefix(client, message, args) {
    const prefix = config.prefix;
    const cmdName = args[0]?.toLowerCase();

    if (cmdName) {
      const command =
        client.commands.get(cmdName) || client.slashCommands.get(cmdName) || null;
      if (!command) {
        return message.reply('Comando não encontrado.');
      }

      const embed = buildCommandEmbed(command, prefix, message.guild.id);
      return message.reply({ embeds: [embed] });
    }

    const embed = buildHelpEmbed(client, prefix, message.guild.id);
    return message.reply({ embeds: [embed] });
  },

  async executeInteraction(client, interaction) {
    const prefix = config.prefix;
    const cmdName = interaction.options.getString('comando')?.toLowerCase();

    if (cmdName) {
      const command =
        client.commands.get(cmdName) || client.slashCommands.get(cmdName) || null;
      if (!command) {
        return interaction.reply({ content: 'Comando não encontrado.', ephemeral: true });
      }

      const embed = buildCommandEmbed(command, prefix, interaction.guildId);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const embed = buildHelpEmbed(client, prefix, interaction.guildId);
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};

function buildHelpEmbed(client, prefix, guildId) {
  const all = new Map();

  for (const [name, cmd] of client.commands) {
    if (!all.has(cmd.category)) all.set(cmd.category, []);
    all.get(cmd.category).push(name);
  }

  const embed = new EmbedBuilder()
    .setTitle(t(guildId, 'commands.help.title'))
    .setDescription(`Prefixo atual: \`${prefix}\``)
    .setColor(0x5865f2)
    .setFooter({
      text: t(guildId, 'commands.help.footer', { prefix })
    });

  for (const [category, cmds] of all) {
    embed.addFields({
      name: `📂 ${capitalize(category)}`,
      value: cmds.map((c) => `\`${c}\``).join(', '),
      inline: false
    });
  }

  return embed;
}

function buildCommandEmbed(command, prefix, guildId) {
  const embed = new EmbedBuilder()
    .setTitle(`Comando: ${command.name}`)
    .setColor(0x5865f2)
    .addFields(
      {
        name: 'Categoria',
        value: command.category || 'N/A',
        inline: true
      },
      {
        name: 'Permissão',
        value: command.permissionLevel || 'user',
        inline: true
      }
    );

  embed.addFields({
    name: 'Uso (prefixo)',
    value: `\`${prefix}${command.name}\``,
    inline: false
  });

  if (command.data && command.data.description) {
    embed.setDescription(command.data.description);
  }

  return embed;
}

function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

