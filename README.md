# 🤖 Discord Multi-Feature Bot

![Node](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?logo=discord)
![License](https://img.shields.io/badge/license-ISC-blue)

Bot de Discord modular em **Node.js** com **discord.js v14**: moderação, economia, música, utilidades, i18n e comandos de contexto (User Install Apps).

---

## ✨ Funcionalidades

| Recurso | Descrição |
|--------|-----------|
| **Prefix + Slash** | Comandos por prefixo (`!`) e slash commands globais/guild |
| **i18n** | Idiomas: EN, PT-BR, ES, JP (fácil expansão) |
| **Permissões** | Níveis: `admin`, `mod`, `user` |
| **Moderação** | Ban, kick, mute, unmute, warn, clear + logs em canal |
| **Auto-mod** | Anti-spam, anti-link, filtro de palavrões (configurável) |
| **Economia** | Moedas, daily, work, shop, buy, inventory, leaderboard (SQLite) |
| **Música** | Play, pause, resume, skip, stop, queue, volume (YouTube) + auto-disconnect sozinho |
| **Diversão** | Meme, 8ball, gif, piada, avatar |
| **Utilidade** | Ping, serverinfo, userinfo, translate, reminder, transcribe, poll, suggest |
| **Context Menu** | Traduzir mensagem, Criar lembrete, Transcrever áudio, Resumir texto (Apps no menu da mensagem) |
| **Eventos** | ready, messageCreate, interactionCreate, guildMemberAdd/Remove, voiceStateUpdate, presenceUpdate, role/channel/emoji/invite/webhooks logs |
| **Logs** | Canal de log e canal de moderação configuráveis por servidor |

---

## 📋 Comandos por categoria

### 🛡️ Moderação
| Comando | Descrição |
|---------|-----------|
| `ban` | Bane um usuário |
| `kick` | Expulsa um usuário |
| `mute` | Aplica timeout (minutos) |
| `unmute` | Remove o timeout |
| `warn` | Registra aviso no log |
| `clear` | Apaga mensagens (1–100) |

### 💰 Economia
| Comando | Descrição |
|---------|-----------|
| `balance` | Mostra saldo (seu ou de outro usuário) |
| `daily` | Recompensa diária de moedas |
| `work` | Trabalha para ganhar moedas (cooldown 1h) |
| `shop` | Lista itens da loja |
| `buy` | Compra item por ID |
| `inventory` | Seus itens comprados |
| `leaderboard` | Ranking de riqueza do servidor |

### 🎵 Música
| Comando | Descrição |
|---------|-----------|
| `play` | Toca música (URL YouTube ou nome) |
| `pause` | Pausa |
| `resume` | Retoma |
| `skip` | Pula para a próxima |
| `stop` | Para e limpa a fila |
| `queue` | Mostra a fila |
| `volume` | Ajusta volume (0–100) |

### 🎮 Diversão
| Comando | Descrição |
|---------|-----------|
| `meme` | Envia um meme aleatório |
| `8ball` | Bola mágica (pergunta sim/não) |
| `gif` | Busca um GIF (Tenor opcional) |
| `piada` | Conta uma piada |
| `avatar` | Mostra avatar de um usuário |

### 🔧 Utilidade
| Comando | Descrição |
|---------|-----------|
| `ping` | Latência do bot |
| `help` | Lista de comandos por categoria |
| `serverinfo` | Informações do servidor |
| `userinfo` | Informações de um usuário |
| `translate` | Traduz texto (ex: `/translate en Olá`) |
| `reminder` | Cria lembrete (ex: `5m`, `1h`, `2d`) |
| `transcribe` | Instruções para transcrever áudio |
| `poll` | Cria enquete (sim/não) |
| `suggest` | Envia sugestão com reações 👍/👎 |

### 📌 Menu de contexto (Apps na mensagem)
- **Traduzir mensagem** – Traduz o texto da mensagem
- **Criar lembrete** – Abre modal para agendar lembrete com a mensagem
- **Transcrever áudio** – Para mensagens com anexo de áudio
- **Resumir texto** – Resumo curto do texto da mensagem

---

## 🚀 Instalação

### Requisitos
- **Node.js** 18+
- **npm** ou **yarn**

### Passos

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Al3ss1Am0d/Discord-Text-to-Voice-Bot.git
   cd Discord-Text-to-Voice-Bot
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o ambiente**
   - Copie `.env.example` para `.env`
   - Preencha:
     ```env
     DISCORD_TOKEN=seu_token_do_bot
     DISCORD_CLIENT_ID=id_do_aplicativo
     DISCORD_GUILD_ID=id_do_servidor_teste  # opcional, para slash em 1 guild
     DEFAULT_LOCALE=pt-BR
     ```
   - (Opcional) `TENOR_API_KEY` para o comando `gif`

4. **Registre os comandos de aplicativo (slash + context menu)**
   ```bash
   npm run deploy:commands
   ```

5. **Inicie o bot**
   ```bash
   npm start
   ```
   Ou em desenvolvimento com auto-reload:
   ```bash
   npm run dev
   ```

### Configuração do servidor (opcional)
- **Canal de logs** e **canal de moderação**: configure no banco (tabela `guild_config`) com `log_channel_id` e `modlog_channel_id` para cada `guild_id`, ou adicione um comando `/setlog` se quiser.
- **Prefix**: editando `config.json` ou variável de ambiente (padrão `!`).

---

## 📁 Estrutura do projeto

```
├── index.js                 # Entrada do bot
├── deploy-commands.js       # Registro de slash/context commands
├── config.json              # Prefixo, idioma padrão, etc.
├── .env                     # Token e variáveis sensíveis (não versionar)
├── src/
│   ├── client.js            # Client customizado (comandos, DB, música)
│   ├── db/
│   │   └── index.js         # SQLite (economia, guild_config, reminders, moderation_logs)
│   ├── handlers/
│   │   ├── commandLoader.js # Carrega comandos e context menu
│   │   └── eventLoader.js   # Carrega eventos
│   ├── events/              # ready, messageCreate, interactionCreate, guildMember*, etc.
│   ├── commands/
│   │   ├── moderation/      # ban, kick, mute, unmute, warn, clear
│   │   ├── economy/         # balance, daily, work, shop, buy, inventory, leaderboard
│   │   ├── fun/             # meme, 8ball, gif, piada, avatar
│   │   ├── utility/         # ping, help, serverinfo, userinfo, translate, reminder, poll, suggest
│   │   └── music/           # play, pause, resume, skip, stop, queue, volume
│   ├── context/             # Context menu: Traduzir, Lembrete, Transcrever, Resumir
│   ├── i18n/                # en, pt-BR, es, jp (JSON)
│   └── utils/               # logger, config, permissions, economy, logChannel, autoMod, musicPlayer
└── data/
    └── bot.sqlite           # Banco SQLite (criado automaticamente)
```

---

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit: `git commit -m 'feat: minha feature'`
4. Push: `git push origin feature/minha-feature`
5. Abra um **Pull Request**

Sugestões e issues são bem-vindos.

---

## 📜 Licença

ISC.

---

## 🙏 Créditos

- [discord.js](https://discord.js.org/) v14
- [@discordjs/voice](https://github.com/discordjs/voice) + [play-dl](https://github.com/play-dl/play-dl) para música
- [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3) para economia e configurações
- [google-translate-api-x](https://github.com/vitalets/google-translate-api-x) para tradução (opcional)

Se você usar este bot como base, um crédito é apreciado.
