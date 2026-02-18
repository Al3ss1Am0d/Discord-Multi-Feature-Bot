// src/utils/autoMod.js
// Auto mod muito simples: anti-link, anti-spam e filtro básico de palavrões.

const badWords = ['palavrão1', 'palavrão2']; // substitua por uma lista real

const recentMessages = new Map();

function isLink(text) {
  return /(https?:\/\/|discord\.gg|discord\.com\/invite)/i.test(text);
}

async function runAutoMod(client, message) {
  const content = message.content.toLowerCase();

  // Anti-link
  if (isLink(content) && !message.member.permissions.has('ManageMessages')) {
    await message.delete().catch(() => {});
    return;
  }

  // Filtro de palavrões
  if (badWords.some((w) => content.includes(w))) {
    await message.delete().catch(() => {});
    return;
  }

  // Anti-spam muito simples: X mensagens em Y segundos
  const key = `${message.guild.id}:${message.author.id}`;
  const now = Date.now();
  const windowMs = 5000;

  if (!recentMessages.has(key)) {
    recentMessages.set(key, []);
  }

  const timestamps = recentMessages.get(key).filter((t) => now - t < windowMs);
  timestamps.push(now);
  recentMessages.set(key, timestamps);

  if (timestamps.length >= 7) {
    // Exemplo de ação: mutar via timeout (requer permissões)
    const member = message.member;
    if (member && member.moderatable) {
      await member.timeout(60 * 1000, 'Auto-mod: spam').catch(() => {});
    }
  }
}

module.exports = { runAutoMod };

