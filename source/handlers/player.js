const { EmbedBuilder, Colors } = require("discord.js");
const { Events } = require("distube");
const { webhookSend, changeLanguage } = require("../utils/clientUtils");
const { catchError } = require("../utils/consoleUtils");
const { newLines } = require("../utils/miscUtils");

module.exports = (client) => {
  const webhookLogEmbed = new EmbedBuilder()
    .setTitle("🎹・Player")
    .setTimestamp();

  client.player.on(Events.ADD_LIST, (queue, playlist) => {
    changeLanguage(client, client.i18n.language);
    webhookLogEmbed
      .setColor(Colors.White)
      .setDescription(
        newLines(
          `Queue:\`\`\`${queue}\`\`\``,
          `Playlist:\`\`\`${playlist}\`\`\``,
        ),
      )
      .setFields([
        {
          name: "Event",
          value: Events.ADD_LIST,
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
    queue.textChannel.send(
      client.i18n.t("handlers.player.addList.added_list", {
        playlist_name: playlist.name,
        amount: playlist.songs.length,
      }),
    );
  });
  client.player.on(Events.ADD_SONG, (queue, song) => {
    changeLanguage(client, client.i18n.language);
    webhookLogEmbed
      .setColor(Colors.White)
      .setDescription(
        newLines(`Queue:\`\`\`${queue}\`\`\``, `Song:\`\`\`${song}\`\`\``),
      )
      .setFields([
        {
          name: "Event",
          value: Events.ADD_SONG,
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
    queue.textChannel.send(
      client.i18n.t("handlers.player.addSong.added_song", {
        song_name: song.name,
        duration: song.formattedDuration,
      }),
    );
  });
  client.player.on(Events.DEBUG, (debug) => {
    webhookLogEmbed
      .setColor(Colors.Blue)
      .setDescription(`Debug:\`\`\`${debug}\`\`\``)
      .setFields([
        {
          name: "Event",
          value: Events.DEBUG,
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
  });
  client.player.on(Events.DELETE_QUEUE, (queue) => {
    changeLanguage(client, client.i18n.language);
    webhookLogEmbed
      .setColor(Colors.Red)
      .setDescription(`Queue:\`\`\`${queue}\`\`\``)
      .setFields([
        {
          name: "Event",
          value: Events.DELETE_QUEUE,
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
    queue.textChannel.send(
      client.i18n.t("handlers.player.deleteQueue.deleted_queue"),
    );
  });
  client.player.on(Events.DISCONNECT, (queue) => {
    changeLanguage(client, client.i18n.language);
    webhookLogEmbed
      .setColor(Colors.Default)
      .setDescription(`Queue:\`\`\`${queue}\`\`\``)
      .setFields([
        {
          name: "Event",
          value: Events.DISCONNECT,
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
    queue.textChannel.send(
      client.i18n.t("handlers.player.disconnect.disconnected"),
    );
  });
  client.player.on(Events.EMPTY, () => {
    webhookLogEmbed.setColor(Colors.Default).setFields([
      {
        name: "Event",
        value: Events.EMPTY,
        inline: true,
      },
    ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
  });
  client.player.on(Events.ERROR, (error, queue, song) => {
    const textChannel = queue?.textChannel;
    const voiceChannel = queue?.voiceChannel;
    const connection = voiceChannel
      ? client.player.voices.get(voiceChannel)
      : null;

    changeLanguage(client, client.i18n.language);

    if (error.message.includes("Unknown Playlist")) {
      if (textChannel)
        void textChannel
          .send(client.i18n.t("handlers.player.error.playlist_not_found"))
          .catch((sendError) =>
            client.logger.error(
              { err: sendError },
              "Failed to send player error message.",
            ),
          );
      return;
    }
    if (connection) connection.leave();

    webhookLogEmbed
      .setColor(Colors.Red)
      .setDescription(
        newLines(
          `Error:\`\`\`${error}\`\`\``,
          `Queue:\`\`\`${queue}\`\`\``,
          `Song:\`\`\`${song}\`\`\``,
        ),
      )
      .setFields([
        {
          name: "Event",
          value: Events.ERROR,
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
    void catchError(client, null, "music", error, true);
  });
  client.player.on(Events.FFMPEG_DEBUG, (debug) => {
    webhookLogEmbed
      .setColor(Colors.Blue)
      .setDescription(`Debug:\`\`\`${debug}\`\`\``)
      .setFields([
        {
          name: "Event",
          value: Events.FFMPEG_DEBUG,
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
  });
  client.player.on(Events.FINISH, (queue) => {
    changeLanguage(client, client.i18n.language);
    webhookLogEmbed
      .setColor(Colors.Green)
      .setDescription(`Queue:\`\`\`${queue}\`\`\``)
      .setFields([
        {
          name: "Event",
          value: Events.FINISH,
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
    queue.textChannel.send(
      client.i18n.t("handlers.player.finish.queue_is_empty"),
    );
  });
  client.player.on(Events.FINISH_SONG, (queue, song) => {
    if (!song) {
      client.logger.warn("Finish song event received without a song.");
      return;
    }

    changeLanguage(client, client.i18n.language);
    webhookLogEmbed
      .setColor(Colors.Green)
      .setDescription(
        newLines(`Queue:\`\`\`${queue}\`\`\``, `Song:\`\`\`${song}\`\`\``),
      )
      .setFields([
        {
          name: "Event",
          value: Events.FINISH_SONG,
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
    if (queue?.textChannel)
      void queue.textChannel
        .send(
          client.i18n.t("handlers.player.finishSong.finished_song", {
            song_name: song.name,
            duration: song.formattedDuration,
          }),
        )
        .catch((error) =>
          client.logger.error(
            { err: error },
            "Failed to send finished song message.",
          ),
        );
  });
  client.player.on(Events.INIT_QUEUE, (queue) => {
    queue.autoplay = false;
    queue.volume = 100;
    queue.filter = "clear";
    queue.createdTimestamp = new Date();

    webhookLogEmbed
      .setColor(Colors.White)
      .setDescription(`Queue:\`\`\`${queue}\`\`\``)
      .setFields([
        {
          name: "Event",
          value: Events.INIT_QUEUE,
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
  });
  client.player.on(Events.NO_RELATED, (queue, error) => {
    changeLanguage(client, client.i18n.language);
    webhookLogEmbed
      .setColor(Colors.Green)
      .setDescription(
        newLines(`Queue:\`\`\`${queue}\`\`\``, `Error:\`\`\`${error}\`\`\``),
      )
      .setFields([
        {
          name: "Event",
          value: Events.NO_RELATED,
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
    queue.textChannel.send(
      client.i18n.t("handlers.player.noRelated.no_related"),
    );
  });
  client.player.on(Events.PLAY_SONG, (queue, song) => {
    changeLanguage(client, client.i18n.language);
    webhookLogEmbed
      .setColor(Colors.White)
      .setDescription(
        newLines(`Queue:\`\`\`${queue}\`\`\``, `Song:\`\`\`${song}\`\`\``),
      )
      .setFields([
        {
          name: "Event",
          value: Events.PLAY_SONG,
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
    queue.textChannel.send(
      client.i18n.t("handlers.player.playSong.playing_song", {
        song_name: song.name,
        duration: song.formattedDuration,
      }),
    );
  });
};
