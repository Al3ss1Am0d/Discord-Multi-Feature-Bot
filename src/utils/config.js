// src/utils/config.js
// Centraliza leitura de config.json e variáveis de ambiente (.env).

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..');
const configPath = path.join(root, 'config.json');

let fileConfig = {
  prefix: '!',
  defaultLocale: 'pt-BR',
  owners: [],
  developerMode: true
};

if (fs.existsSync(configPath)) {
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    fileConfig = { ...fileConfig, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Não foi possível ler config.json, usando padrões.', err);
  }
}

module.exports = {
  prefix: fileConfig.prefix,
  defaultLocale: process.env.DEFAULT_LOCALE || fileConfig.defaultLocale || 'en',
  owners: fileConfig.owners || [],
  developerMode: fileConfig.developerMode ?? false
};

