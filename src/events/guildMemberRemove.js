// src/events/guildMemberRemove.js
// Disparado quando um membro sai ou é kickado/banido.

const { logEvent } = require('../utils/logChannel');

module.exports = {
  name: 'guildMemberRemove',
  async execute(client, member) {
    await logEvent(client, member.guild, '👋 Membro saiu', {
      description: `${member.user.tag} (${member.id})`
    });
  }
};

