// src/handlers/commandLoader.js
// Carrega comandos prefixados, slash e context menu + helper para registrar no Discord.

const fs = require('fs');
const path = require('path');
const { REST, Routes, ApplicationCommandType } = require('discord.js');
const logger = require('../utils/logger');
const config = require('../utils/config');

function walk(dir, ext = '.js') {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(full, ext));
    else if (entry.isFile() && entry.name.endsWith(ext)) result.push(full);
  }
  return result;
}

async function loadCommands(client, commandsRoot) {
  if (!fs.existsSync(commandsRoot)) return;

  const commandFiles = walk(commandsRoot);

  for (const file of commandFiles) {
    const command = require(file);

    // Convenção: todos os comandos exportam "name", "category", "executePrefix" (opcional),
    // "data" (SlashCommandBuilder ou objeto raw) opcional, "executeInteraction" opcional.
    if (!command || !command.name) {
      logger.warn(`Comando ignorado (falta name): ${file}`);
      continue;
    }

    // Comandos prefixados
    if (typeof command.executePrefix === 'function') {
      client.commands.set(command.name, command);
    }

    // Slash commands
    if (command.data && (command.data.name || command.data.toJSON)) {
      const name = command.data.name || command.data.toJSON().name;
      client.slashCommands.set(name, command);
    }
  }

  // Context menu commands (message/user) em src/context
  const contextRoot = path.join(commandsRoot, '..', 'context');
  if (fs.existsSync(contextRoot)) {
    const contextFiles = walk(contextRoot);
    for (const file of contextFiles) {
      const context = require(file);
      if (!context || !context.data || !context.data.name) {
        logger.warn(`Context command ignorado: ${file}`);
        continue;
      }
      if (
        context.data.type === ApplicationCommandType.Message ||
        context.data.type === ApplicationCommandType.User
      ) {
        client.contextCommands.set(context.data.name, context);
      }
    }
  }
}

async function registerApplicationCommands(client, { commandsPath, contextPath }) {
  const applicationCommands = [];

  // Slash commands
  if (fs.existsSync(commandsPath)) {
    const files = walk(commandsPath);
    for (const file of files) {
      const command = require(file);
      if (command && command.data && (command.data.name || command.data.toJSON)) {
        applicationCommands.push(command.data.toJSON ? command.data.toJSON() : command.data);
      }
    }
  }

  // Context menu commands
  if (contextPath && fs.existsSync(contextPath)) {
    const files = walk(contextPath);
    for (const file of files) {
      const context = require(file);
      if (context && context.data && context.data.name) {
        applicationCommands.push(context.data);
      }
    }
  }

  if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CLIENT_ID) {
    logger.warn('DISCORD_TOKEN ou DISCORD_CLIENT_ID não configurados; pulando registro de commands.');
    return;
  }

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    logger.info(`Registrando ${applicationCommands.length} application commands (global)...`);
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
      body: applicationCommands
    });

    if (process.env.DISCORD_GUILD_ID) {
      logger.info(
        `Registrando ${applicationCommands.length} application commands para guild de desenvolvimento...`
      );
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.DISCORD_CLIENT_ID,
          process.env.DISCORD_GUILD_ID
        ),
        { body: applicationCommands }
      );
    }

    logger.info('Application commands registrados com sucesso.');
  } catch (err) {
    logger.error('Erro ao registrar application commands:', err);
  }
}

module.exports = {
  loadCommands,
  registerApplicationCommands
};

