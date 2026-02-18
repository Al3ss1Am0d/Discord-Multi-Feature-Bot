// src/utils/musicPlayer.js
// Wrapper simples em torno de play-dl + @discordjs/voice para fila de música.
// Este módulo é mantido simples para facilitar manutenção; pode ser expandido depois.

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
  entersState
} = require('@discordjs/voice');
const play = require('play-dl');
const { Collection } = require('discord.js');
const logger = require('./logger');

function createGuildQueue() {
  return {
    connection: null,
    player: null,
    textChannelId: null,
    voiceChannelId: null,
    songs: [],
    volume: 0.5,
    playing: false
  };
}

function createMusicManager(client) {
  const queues = new Collection();

  async function connect(guild, voiceChannelId, textChannelId) {
    let queue = queues.get(guild.id);
    if (!queue) {
      queue = createGuildQueue();
      queues.set(guild.id, queue);
    }

    queue.textChannelId = textChannelId;
    queue.voiceChannelId = voiceChannelId;

    if (!queue.connection) {
      queue.connection = joinVoiceChannel({
        channelId: voiceChannelId,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator
      });

      queue.connection.on(VoiceConnectionStatus.Disconnected, () => {
        queues.delete(guild.id);
      });
    }

    if (!queue.player) {
      const player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause
        }
      });

      player.on(AudioPlayerStatus.Idle, () => {
        queue.songs.shift();
        if (queue.songs.length === 0) {
          queue.playing = false;
          // Auto-disconnect quando a fila acaba
          if (queue.connection) {
            queue.connection.destroy();
          }
          queues.delete(guild.id);
        } else {
          playNext(guild.id).catch((err) =>
            logger.error('Erro ao tocar próxima música:', err)
          );
        }
      });

      queue.player = player;
      queue.connection.subscribe(player);
    }

    return queue;
  }

  async function playNext(guildId) {
    const queue = queues.get(guildId);
    if (!queue || queue.songs.length === 0) return;

    const song = queue.songs[0];

    const source = await play.stream(song.url);
    const resource = createAudioResource(source.stream, {
      inputType: source.type,
      inlineVolume: true
    });
    resource.volume.setVolume(queue.volume);

    queue.player.play(resource);
    queue.playing = true;
  }

  return {
    queues,
    async addToQueue({ guild, voiceChannelId, textChannelId, query, requestedBy }) {
      const queue = await connect(guild, voiceChannelId, textChannelId);

      // Se for uma URL direta, usa; senão, faz busca
      let info;
      if (play.yt_validate(query) === 'video') {
        info = await play.video_basic_info(query);
      } else {
        const search = await play.search(query, { limit: 1 });
        info = search[0];
      }

      const song = {
        title: info.title,
        url: info.url,
        requestedBy
      };

      queue.songs.push(song);

      if (!queue.playing) {
        await playNext(guild.id);
      }

      return song;
    },
    pause(guildId) {
      const queue = queues.get(guildId);
      if (!queue || !queue.player) return false;
      queue.player.pause();
      return true;
    },
    resume(guildId) {
      const queue = queues.get(guildId);
      if (!queue || !queue.player) return false;
      queue.player.unpause();
      return true;
    },
    skip(guildId) {
      const queue = queues.get(guildId);
      if (!queue || !queue.player) return false;
      queue.player.stop(true);
      return true;
    },
    stop(guildId) {
      const queue = queues.get(guildId);
      if (!queue) return false;
      if (queue.player) queue.player.stop(true);
      if (queue.connection) queue.connection.destroy();
      queues.delete(guildId);
      return true;
    },
    setVolume(guildId, volume) {
      const queue = queues.get(guildId);
      if (!queue || !queue.player) return false;
      queue.volume = volume;
      return true;
    },
    getQueue(guildId) {
      return queues.get(guildId);
    }
  };
}

module.exports = { createMusicManager };

