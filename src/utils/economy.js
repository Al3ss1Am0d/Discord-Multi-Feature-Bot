// src/utils/economy.js
// Helpers para o sistema de economia (balance, daily, work).

const db = require('../db');

const DAILY_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const DAILY_AMOUNT = 500;
const WORK_COOLDOWN_MS = 60 * 60 * 1000; // 1h
const WORK_MIN = 50;
const WORK_MAX = 200;

function getOrCreate(userId, guildId) {
  let row = db
    .prepare('SELECT * FROM economy_users WHERE user_id = ? AND guild_id = ?')
    .get(userId, guildId);
  if (!row) {
    db.prepare(
      'INSERT INTO economy_users (user_id, guild_id, balance, last_daily) VALUES (?, ?, 0, NULL)'
    ).run(userId, guildId);
    row = db
      .prepare('SELECT * FROM economy_users WHERE user_id = ? AND guild_id = ?')
      .get(userId, guildId);
  }
  return row;
}

function getBalance(userId, guildId) {
  const row = getOrCreate(userId, guildId);
  return row.balance;
}

function addBalance(userId, guildId, amount) {
  getOrCreate(userId, guildId);
  db.prepare(
    'UPDATE economy_users SET balance = balance + ? WHERE user_id = ? AND guild_id = ?'
  ).run(amount, userId, guildId);
  return getBalance(userId, guildId);
}

function setBalance(userId, guildId, amount) {
  getOrCreate(userId, guildId);
  db.prepare(
    'UPDATE economy_users SET balance = ? WHERE user_id = ? AND guild_id = ?'
  ).run(Math.max(0, amount), userId, guildId);
  return getBalance(userId, guildId);
}

function canDaily(userId, guildId) {
  const row = getOrCreate(userId, guildId);
  if (!row.last_daily) return { can: true, nextAt: null };
  const nextAt = row.last_daily + DAILY_COOLDOWN_MS;
  return { can: Date.now() >= nextAt, nextAt };
}

function claimDaily(userId, guildId) {
  const check = canDaily(userId, guildId);
  if (!check.can) return { ok: false, balance: getBalance(userId, guildId), nextAt: check.nextAt };
  db.prepare(
    'UPDATE economy_users SET balance = balance + ?, last_daily = ? WHERE user_id = ? AND guild_id = ?'
  ).run(DAILY_AMOUNT, Date.now(), userId, guildId);
  return { ok: true, amount: DAILY_AMOUNT, balance: getBalance(userId, guildId) };
}

// Adiciona coluna last_work se não existir (migration simples)
try {
  db.prepare('SELECT last_work FROM economy_users LIMIT 1').get();
} catch {
  try {
    db.prepare('ALTER TABLE economy_users ADD COLUMN last_work INTEGER').run();
  } catch (_) {}
}

function getLastWork(userId, guildId) {
  try {
    const row = db
      .prepare('SELECT last_work FROM economy_users WHERE user_id = ? AND guild_id = ?')
      .get(userId, guildId);
    return row?.last_work ?? null;
  } catch {
    return null;
  }
}

function canWork(userId, guildId) {
  const last = getLastWork(userId, guildId);
  if (!last) return { can: true, nextAt: null };
  const nextAt = last + WORK_COOLDOWN_MS;
  return { can: Date.now() >= nextAt, nextAt };
}

function claimWork(userId, guildId) {
  const check = canWork(userId, guildId);
  if (!check.can) return { ok: false, balance: getBalance(userId, guildId), nextAt: check.nextAt };
  const amount = WORK_MIN + Math.floor(Math.random() * (WORK_MAX - WORK_MIN + 1));
  getOrCreate(userId, guildId);
  db.prepare(
    'UPDATE economy_users SET balance = balance + ?, last_work = ? WHERE user_id = ? AND guild_id = ?'
  ).run(amount, Date.now(), userId, guildId);
  return { ok: true, amount, balance: getBalance(userId, guildId) };
}

function getLeaderboard(guildId, limit = 10) {
  const rows = db
    .prepare(
      'SELECT user_id, balance FROM economy_users WHERE guild_id = ? ORDER BY balance DESC LIMIT ?'
    )
    .all(guildId, limit);
  return rows;
}

module.exports = {
  getBalance,
  addBalance,
  setBalance,
  canDaily,
  claimDaily,
  canWork,
  claimWork,
  getLeaderboard,
  DAILY_AMOUNT,
  DAILY_COOLDOWN_MS,
  WORK_COOLDOWN_MS
};
