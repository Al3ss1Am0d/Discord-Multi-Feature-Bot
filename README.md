# 🤖 Discord Multi-Feature Bot

![Node](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?logo=discord)
![License](https://img.shields.io/badge/license-ISC-blue)

Modular Discord bot in **Node.js** with **discord.js v14**: moderation, economy, music, utilities, i18n, and context commands (User Install Apps).

---

## ✨ Features

| Feature | Description |
|--------|-----------|
| **Prefix + Slash** | Commands via prefix (`!`) and global/guild slash commands |
| **i18n** | Languages: EN, PT-BR, ES, JP (easy expansion) |
| **Permissions** | Levels: `admin`, `mod`, `user` |
| **Moderation** | Ban, kick, mute, unmute, warn, clear + channel logs |
| **Auto-mod** | Anti-spam, anti-link, profanity filter (configurable) |
| **Economy** | Currency, daily, work, shop, buy, inventory, leaderboard (SQLite) |
| **Music** | Play, pause, resume, skip, stop, queue, volume (YouTube) + auto-disconnect |
| **Fun** | Meme, 8ball, gif, joke, avatar |
| **Utility** | Ping, serverinfo, userinfo, translate, reminder, transcribe, poll, suggest |
| **Context Menu** | Translate message, Create reminder, Transcribe audio, Summarize text (Apps in message menu) |
| **Events** | ready, messageCreate, interactionCreate, guildMemberAdd/Remove, voiceStateUpdate, presenceUpdate, role/channel/emoji/invite/webhooks logs |
| **Logs** | Configurable log and moderation channels per server |

---

## 📋 Commands by Category

### 🛡️ Moderation
| Command | Description |
|---------|-----------|
| `ban` | Bans a user |
| `kick` | Kicks a user |
| `mute` | Applies timeout (minutes) |
| `unmute` | Removes timeout |
| `warn` | Records a warning in logs |
| `clear` | Deletes messages (1–100) |

### 💰 Economy
| Command | Description |
|---------|-----------|
| `balance` | Shows balance (yours or another user’s) |
| `daily` | Daily coin reward |
| `work` | Work to earn coins (1h cooldown) |
| `shop` | Lists shop items |
| `buy` | Buys item by ID |
| `inventory` | Your purchased items |
| `leaderboard` | Server wealth ranking |

### 🎵 Music
| Command | Description |
|---------|-----------|
| `play` | Plays music (YouTube URL or name) |
| `pause` | Pauses |
| `resume` | Resumes |
| `skip` | Skips to next |
| `stop` | Stops and clears queue |
| `queue` | Shows queue |
| `volume` | Adjusts volume (0–100) |

### 🎮 Fun
| Command | Description |
|---------|-----------|
| `meme` | Sends a random meme |
| `8ball` | Magic 8-ball (yes/no question) |
| `gif` | Searches a GIF (optional Tenor) |
| `piada` | Tells a joke |
| `avatar` | Shows a user’s avatar |

### 🔧 Utility
| Command | Description |
|---------|-----------|
| `ping` | Bot latency |
| `help` | Command list by category |
| `serverinfo` | Server information |
| `userinfo` | User information |
| `translate` | Translates text (e.g. `/translate en Hello`) |
| `reminder` | Creates reminder (e.g. `5m`, `1h`, `2d`) |
| `transcribe` | Instructions to transcribe audio |
| `poll` | Creates yes/no poll |
| `suggest` | Sends suggestion with 👍/👎 reactions |

### 📌 Context Menu (Message Apps)
- **Translate message** – Translates message text
- **Create reminder** – Opens modal to schedule reminder with message
- **Transcribe audio** – For messages with audio attachments
- **Summarize text** – Short summary of message text

---

## 🚀 Installation

### Requirements
- **Node.js** 18+
- **npm** or **yarn**

### Steps

1. **Clone repository**
   ```bash
   git clone https://github.com/Al3ss1Am0d/Discord-Text-to-Voice-Bot.git
   cd Discord-Text-to-Voice-Bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Copy `.env.example` to `.env`
   - Fill in:
     ```env
     DISCORD_TOKEN=your_bot_token
     DISCORD_CLIENT_ID=application_id
     DISCORD_GUILD_ID=test_server_id  # optional, for slash in 1 guild
     DEFAULT_LOCALE=en
     ```
   - (Optional) `TENOR_API_KEY` for `gif` command

4. **Register application commands (slash + context menu)**
   ```bash
   npm run deploy:commands
   ```

5. **Start bot**
   ```bash
   npm start
   ```
   Or in development with auto-reload:
   ```bash
   npm run dev
   ```

### Server configuration (optional)
- **logs channel** e **moderation channel**: configure in DB (`guild_config` table) with `log_channel_id` and `modlog_channel_id` for each `guild_id`, or add `/setlog` command if desired.
- **Prefix**: edit `config.json` or environment variable (default `!`).

---

## 📁 Estrutura do projeto

```
├── index.js                 # Bot entry
├── deploy-commands.js       # Slash/context command registration
├── config.json              # Prefix, default language, etc.
├── .env                     # Token and sensitive variables (not versioned)
├── src/
│   ├── client.js            # Custom client (commands, DB, music)
│   ├── db/
│   │   └── index.js         # SQLite (economy, guild_config, reminders, moderation_logs)
│   ├── handlers/
│   │   ├── commandLoader.js # Loads commands and context menu
│   │   └── eventLoader.js   # Loads events
│   ├── events/              # ready, messageCreate, interactionCreate, guildMember*, etc.
│   ├── commands/
│   │   ├── moderation/      # ban, kick, mute, unmute, warn, clear
│   │   ├── economy/         # balance, daily, work, shop, buy, inventory, leaderboard
│   │   ├── fun/             # meme, 8ball, gif, joke, avatar
│   │   ├── utility/         # ping, help, serverinfo, userinfo, translate, reminder, poll, suggest
│   │   └── music/           # play, pause, resume, skip, stop, queue, volume
│   ├── context/             # Context menu: Translate, Reminder, Transcribe, Summarize
│   ├── i18n/                # en, pt-BR, es, jp (JSON)
│   └── utils/               # logger, config, permissions, economy, logChannel, autoMod, musicPlayer
└── data/
    └── bot.sqlite           # SQLite DB (auto-created)
```

---

## 🤝 Contribuição

1. Fork the project
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'feat: my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a **Pull Request**

Suggestions and issues are welcome.

---

## 📜 License

ISC.

---

## 🙏 Credits

- [discord.js](https://discord.js.org/) v14
- [@discordjs/voice](https://github.com/discordjs/voice) + [play-dl](https://github.com/play-dl/play-dl) for music
- [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3)  for economy and configs
- [google-translate-api-x](https://github.com/vitalets/google-translate-api-x) for translation (optional)

If you use this bot as a base, credit is appreciated.
