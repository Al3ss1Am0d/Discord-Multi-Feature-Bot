// deploy-commands.js
// Script manual para registrar slash commands e context menu (global e por guild).

require('dotenv').config();

const path = require('path');
const { registerApplicationCommands } = require('./src/handlers/commandLoader');
const createBotClient = require('./src/client');
const { GatewayIntentBits } = require('discord.js');

async function main() {
  const client = createBotClient({
    intents: [GatewayIntentBits.Guilds]
  });

  await registerApplicationCommands(client, {
    commandsPath: path.join(__dirname, 'src', 'commands'),
    contextPath: path.join(__dirname, 'src', 'context')
  });

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

