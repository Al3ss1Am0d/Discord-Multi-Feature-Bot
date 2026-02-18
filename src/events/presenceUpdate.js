// src/events/presenceUpdate.js
// Exemplo de log de mudança de presença (simples, para não gerar flood).

const { logEvent } = require('../utils/logChannel');

module.exports = {
  name: 'presenceUpdate',
  async execute(client, oldPresence, newPresence) {
    if (!newPresence || !newPresence.guild) return;

    // Apenas loga mudanças de status online/offline
    const oldStatus = oldPresence?.status;
    const newStatus = newPresence.status;
    if (oldStatus === newStatus) return;

    await logEvent(client, newPresence.guild, '🟢 Mudança de presença', {
      description: `${newPresence.user.tag}: ${oldStatus || 'unknown'} -> ${newStatus}`
    });
  }
};

