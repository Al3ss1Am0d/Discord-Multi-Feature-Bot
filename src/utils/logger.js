// src/utils/logger.js
// Logger simples, mas centralizado, para facilitar troca futura (winston, pino, etc.).

const chalk = require('chalk');

function time() {
  return new Date().toISOString();
}

module.exports = {
  info: (...args) => console.log(chalk.blue(`[INFO] [${time()}]`), ...args),
  warn: (...args) => console.warn(chalk.yellow(`[WARN] [${time()}]`), ...args),
  error: (...args) => console.error(chalk.red(`[ERROR] [${time()}]`), ...args),
  debug: (...args) => {
    if (process.env.DEBUG) {
      console.log(chalk.gray(`[DEBUG] [${time()}]`), ...args);
    }
  }
};

