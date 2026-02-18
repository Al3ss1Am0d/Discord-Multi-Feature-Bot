// src/events/interactionCreate.js
// Lida com slash commands e context menu (User/Message).

const { InteractionType, ApplicationCommandType } = require('discord.js');
const { t } = require('../i18n');
const { hasLevel } = require('../utils/permissions');

module.exports = {
  name: 'interactionCreate',
  async execute(client, interaction) {
    try {
      if (interaction.type === InteractionType.ApplicationCommand) {
        if (interaction.isChatInputCommand()) {
          const command = client.slashCommands.get(interaction.commandName);
          if (!command) return;

          // Sistema de permissão (opcional nos metadados do comando)
          if (command.permissionLevel && interaction.inGuild()) {
            const member = interaction.member;
            if (!hasLevel(member, command.permissionLevel)) {
              return interaction.reply({
                content: t(interaction.guildId, 'general.no_permission'),
                ephemeral: true
              });
            }
          }

          await command.executeInteraction(client, interaction);
        } else if (
          interaction.commandType === ApplicationCommandType.Message ||
          interaction.commandType === ApplicationCommandType.User
        ) {
          const contextCmd = client.contextCommands.get(interaction.commandName);
          if (!contextCmd) return;
          await contextCmd.execute(client, interaction);
        }
      }
    } catch (err) {
      client.logger.error('Erro em interactionCreate:', err);
      if (interaction.replied || interaction.deferred) return;
      interaction
        .reply({
          content: t(interaction.guildId, 'general.error_generic'),
          ephemeral: true
        })
        .catch(() => {});
    }
  }
};

