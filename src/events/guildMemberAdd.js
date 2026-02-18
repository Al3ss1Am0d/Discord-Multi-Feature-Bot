// src/events/guildMemberAdd.js
// Disparado quando um membro entra no servidor.

const { logEvent } = require('../utils/logChannel');

module.exports = {
  name: 'guildMemberAdd',
  async execute(client, member) {
    await logEvent(client, member.guild, '👋 Novo membro entrou', {
      description: `${member.user.tag} (${member.id})`
    });
  }
};

