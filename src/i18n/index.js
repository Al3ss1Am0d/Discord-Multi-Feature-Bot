// src/i18n/index.js
// Sistema simples de i18n baseado em JSONs.

const path = require('path');
const fs = require('fs');
const config = require('../utils/config');
const db = require('../db');

const localesDir = __dirname;

const cache = {};

function loadLocale(locale) {
  if (cache[locale]) return cache[locale];

  const filePath = path.join(localesDir, `${locale}.json`);
  if (!fs.existsSync(filePath)) {
    if (locale !== 'en') {
      return loadLocale('en');
    }
    cache[locale] = {};
    return cache[locale];
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    cache[locale] = JSON.parse(raw);
  } catch (err) {
    console.error(`Erro ao carregar locale ${locale}:`, err);
    cache[locale] = {};
  }

  return cache[locale];
}

function getGuildLocale(guildId) {
  if (!guildId) return config.defaultLocale;
  try {
    const row = db
      .prepare('SELECT locale FROM guild_config WHERE guild_id = ?')
      .get(guildId);
    return row?.locale || config.defaultLocale;
  } catch {
    return config.defaultLocale;
  }
}

/**
 * Traduz uma chave no idioma da guilda.
 * Ex: t(guild.id, 'commands.ping.pong', { user: message.author.username })
 */
function t(guildId, key, vars = {}) {
  const locale = getGuildLocale(guildId);
  const messages = loadLocale(locale);

  const parts = key.split('.');
  let current = messages;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      current = null;
      break;
    }
  }

  let text = typeof current === 'string' ? current : key;

  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
  }

  return text;
}

module.exports = { t, getGuildLocale };

