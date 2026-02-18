// index.js
// Ponto de entrada do bot. Aqui criamos o client, carregamos comandos/eventos
// e fazemos o login no Discord.

require('dotenv').config();

const { GatewayIntentBits, Partials } = require('discord.js');
const path = require('path');

const createBotClient = require('./src/client');
const { loadEvents } = require('./src/handlers/eventLoader');
const { loadCommands, registerApplicationCommands } = require('./src/handlers/commandLoader');
const logger = require('./src/utils/logger');
const config = require('./src/utils/config');

async function main() {
  const client = createBotClient({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember, Partials.User]
  });

  // Carregamento modular
  await loadCommands(client, path.join(__dirname, 'src', 'commands'));
  await loadEvents(client, path.join(__dirname, 'src', 'events'));

  // Registra slash & context menu (pode ser rodado também via script separado)
  if (config.developerMode) {
    registerApplicationCommands(client, {
      commandsPath: path.join(__dirname, 'src', 'commands'),
      contextPath: path.join(__dirname, 'src', 'context')
    }).catch((err) => logger.error('Falha ao registrar application commands:', err));
  }

  client.login(process.env.DISCORD_TOKEN).catch((err) => {
    logger.error('Erro ao fazer login no Discord:', err);
    process.exit(1);
  });
}

main().catch((err) => {
  logger.error('Erro fatal na inicialização do bot:', err);
  process.exit(1);
});

