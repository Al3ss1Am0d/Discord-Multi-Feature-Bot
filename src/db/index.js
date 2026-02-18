// src/db/index.js
// Inicializa o banco SQLite (better-sqlite3) e garante as tabelas básicas.

const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', '..', 'data', 'bot.sqlite');

// Garante que a pasta data exista
const fs = require('fs');
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Tabelas de economia
db.prepare(
  `CREATE TABLE IF NOT EXISTS economy_users (
    user_id TEXT NOT NULL,
    guild_id TEXT NOT NULL,
    balance INTEGER NOT NULL DEFAULT 0,
    last_daily INTEGER,
    PRIMARY KEY (user_id, guild_id)
  )`
).run();

// Itens compráveis da economia (tabela simples, mas você pode popular via comandos/admin)
db.prepare(
  `CREATE TABLE IF NOT EXISTS economy_inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    guild_id TEXT NOT NULL,
    item_id TEXT NOT NULL,
    item_name TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`
).run();

// Tabela de configurações por guild (idioma, canais de log, etc.)
db.prepare(
  `CREATE TABLE IF NOT EXISTS guild_config (
    guild_id TEXT PRIMARY KEY,
    locale TEXT DEFAULT 'pt-BR',
    log_channel_id TEXT,
    modlog_channel_id TEXT,
    prefix TEXT
  )`
).run();

// Tabela de avisos/moderação
db.prepare(
  `CREATE TABLE IF NOT EXISTS moderation_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    moderator_id TEXT NOT NULL,
    action TEXT NOT NULL,
    reason TEXT,
    created_at INTEGER NOT NULL
  )`
).run();

// Tabela de lembretes
db.prepare(
  `CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    guild_id TEXT,
    channel_id TEXT,
    message TEXT NOT NULL,
    remind_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  )`
).run();

module.exports = db;

