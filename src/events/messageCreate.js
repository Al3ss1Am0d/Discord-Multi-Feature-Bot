// src/events/messageCreate.js
// Lida com comandos prefixados + auto mod simples.

const config = require('../utils/config');
const { t } = require('../i18n');
const { hasLevel } = require('../utils/permissions');
const { runAutoMod } = require('../utils/autoMod');

module.exports = {
  name: 'messageCreate',
  async execute(client, message) {
    if (message.author.bot || !message.guild) return;

    // Auto mod (anti-spam/links/palavrão simplificado)
    await runAutoMod(client, message);

    const prefix = config.prefix; // pode ser expandido para prefix por guild via DB

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    const command = client.commands.get(commandName);
    if (!command) return;

    // Permissões por nível
    if (command.permissionLevel) {
      const member = message.member;
      if (!hasLevel(member, command.permissionLevel)) {
        return message.reply(t(message.guild.id, 'general.no_permission'));
      }
    }

    try {
      await command.executePrefix(client, message, args);
    } catch (err) {
      client.logger.error(`Erro no comando prefixado ${commandName}:`, err);
      message.reply(t(message.guild.id, 'general.error_generic')).catch(() => {});
    }
  }
};

