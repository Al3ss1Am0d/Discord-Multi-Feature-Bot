// src/events/ready.js
// Disparado quando o bot fica online.

const { ActivityType } = require('discord.js');
const { t } = require('../i18n');
const db = require('../db');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    client.logger.info(`Logado como ${client.user.tag}`);

    // Status dinâmico simples
    const activities = [
      { name: 'música 🎵', type: ActivityType.Listening },
      { name: 'seu servidor 👀', type: ActivityType.Watching },
      { name: 'moderação ⚔️', type: ActivityType.Playing }
    ];

    let index = 0;
    const setActivity = () => {
      const activity = activities[index++ % activities.length];
      client.user.setActivity(activity.name, { type: activity.type });
    };

    setActivity();
    setInterval(setActivity, 1000 * 60);

    // Verificação de lembretes a cada 30 segundos
    setInterval(async () => {
      try {
        const now = Date.now();
        const rows = db.prepare('SELECT * FROM reminders WHERE remind_at <= ?').all(now);
        for (const row of rows) {
          try {
            const channel = row.channel_id
              ? await client.channels.fetch(row.channel_id).catch(() => null)
              : null;
            const content = `⏰ Lembrete: ${row.message}`;
            if (channel && channel.isTextBased()) {
              await channel.send(`<@${row.user_id}> ${content}`);
            } else {
              const user = await client.users.fetch(row.user_id).catch(() => null);
              if (user) await user.send(content).catch(() => {});
            }
          } catch (_) {}
          db.prepare('DELETE FROM reminders WHERE id = ?').run(row.id);
        }
      } catch (_) {}
    }, 30000);

    client.logger.debug(t(null, 'commands.ping.description'));
  }
};

