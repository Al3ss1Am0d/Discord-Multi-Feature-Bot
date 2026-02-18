// src/utils/permissions.js
// Sistema simples de permissão por nível: admin, mod, user.

const { PermissionsBitField } = require('discord.js');

function hasLevel(member, level) {
  if (!member) return false;

  if (level === 'user') return true;

  if (level === 'mod') {
    return (
      member.permissions.has(PermissionsBitField.Flags.ManageMessages) ||
      member.permissions.has(PermissionsBitField.Flags.KickMembers) ||
      member.permissions.has(PermissionsBitField.Flags.BanMembers) ||
      member.permissions.has(PermissionsBitField.Flags.Administrator)
    );
  }

  if (level === 'admin') {
    return member.permissions.has(PermissionsBitField.Flags.Administrator);
  }

  return false;
}

module.exports = { hasLevel };

