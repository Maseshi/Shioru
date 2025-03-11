const { EmbedBuilder, Colors } = require("discord.js");
const { webhookSend, changeLanguage } = require("../utils/clientUtils");
const { catchError } = require("../utils/consoleUtils");
const { newLines } = require("../utils/miscUtils");

module.exports = (client) => {
  const webhookLogEmbed = new EmbedBuilder()
    .setTitle("🎹・Player")
    .setTimestamp();

  client.player.on("addList", (queue, playlist) => {
    changeLanguage(client, client.i18n.language);
    webhookLogEmbed
      .setColor(Colors.White)
      .setDescription(
        `Queue:\`\`\`${queue}\`\`\`\nPlaylist:\`\`\`${playlist}\`\`\``,
      )
      .setFields([
        {
          name: "Event",
          value: "addList",
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
  client.player.on("addSong", (queue, song) => {
    changeLanguage(client, client.i18n.language);
    webhookLogEmbed
      .setColor(Colors.White)
      .setDescription(`Queue:\`\`\`${queue}\`\`\`\nSong:\`\`\`${song}\`\`\``)
      .setFields([
        {
          name: "Event",
          value: "addSong",
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
  client.player.on("disconnect", (queue) => {
    changeLanguage(client, client.i18n.language);
    webhookLogEmbed
      .setColor(Colors.Default)
      .setDescription(`Queue:\`\`\`${queue}\`\`\``)
      .setFields([
        {
          name: "Event",
          value: "disconnect",
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
  client.player.on("empty", (queue) => {
    changeLanguage(client, client.i18n.language);
    webhookLogEmbed
      .setColor(Colors.Default)
      .setDescription(`Queue:\`\`\`${queue}\`\`\``)
      .setFields([
        {
          name: "Event",
          value: "empty",
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
    queue.textChannel.send(
      client.i18n.t("handlers.player.empty.no_user_in_channel"),
    );
  });
  client.player.on("error", (channel, error) => {
    const meChannel = channel.guild.members.me.voice.channel;
    const connection = client.player.voices.get(meChannel.guild);

    changeLanguage(client, client.i18n.language);

    if (error.message.includes("Unknown Playlist"))
      return channel.send(
        client.i18n.t("handlers.player.error.playlist_not_found"),
      );
    if (connection) connection.leave(meChannel.guild);

    webhookLogEmbed
      .setColor(Colors.Red)
      .setDescription(
        `Channel:\`\`\`${channel}\`\`\`\nError:\`\`\`${error}\`\`\``,
      )
      .setFields([
        {
          name: "Event",
          value: "error",
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
    catchError(client, channel, "music", error);
  });
  client.player.on("finish", (queue) => {
    changeLanguage(client, client.i18n.language);
    webhookLogEmbed
      .setColor(Colors.Green)
      .setDescription(`Queue:\`\`\`${queue}\`\`\``)
      .setFields([
        {
          name: "Event",
          value: "finish",
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
  client.player.on("initQueue", (queue) => {
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
          value: "initQueue",
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
  });
  client.player.on("playSong", (queue, song) => {
    changeLanguage(client, client.i18n.language);
    webhookLogEmbed
      .setColor(Colors.White)
      .setDescription(`Queue:\`\`\`${queue}\`\`\`\nSong:\`\`\`${song}\`\`\``)
      .setFields([
        {
          name: "Event",
          value: "playSong",
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
  client.player.on("searchCancel", (message) => {
    changeLanguage(client, client.i18n.language);
    webhookLogEmbed
      .setColor(Colors.Default)
      .setDescription(`Message:\`\`\`${message}\`\`\``)
      .setFields([
        {
          name: "Event",
          value: "searchCancel",
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
    message.reply(
      client.i18n.t("handlers.player.searchCancel.search_cancelled"),
    );
  });
  client.player.on("searchDone", (message) => {
    changeLanguage(client, client.i18n.language);
    webhookLogEmbed
      .setColor(Colors.Blue)
      .setDescription(`Message:\`\`\`${message}\`\`\``)
      .setFields([
        {
          name: "Event",
          value: "searchDone",
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
    message.reply(
      client.i18n.t("handlers.player.searchDone.get_list_of_songs"),
    );
  });
  client.player.on("searchInvalidAnswer", (message, answer) => {
    changeLanguage(client, client.i18n.language);
    webhookLogEmbed
      .setColor(Colors.Orange)
      .setDescription(
        `Message:\`\`\`${message}\`\`\`\nAnswer:\`\`\`${answer}\`\`\``,
      )
      .setFields([
        {
          name: "Event",
          value: "searchInvalidAnswer",
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
    answer.reply(
      client.i18n.t("handlers.player.searchInvalidAnswer.search_cancelled"),
    );
  });
  client.player.on("searchNoResult", (message) => {
    changeLanguage(client, client.i18n.language);
    webhookLogEmbed
      .setColor(Colors.Default)
      .setDescription(`Message:\`\`\`${message}\`\`\``)
      .setFields([
        {
          name: "Event",
          value: "searchNoResult",
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
    message.reply(client.i18n.t("handlers.player.searchNoResult.no_results"));
  });
  client.player.on("searchResult", (message, result) => {
    const data = newLines(
      result.map(
        (song, index) =>
          `**${index}**. ${song.name} \`${song.formattedDuration}\` : **${song.uploader.name}**`,
      ),
    );

    changeLanguage(client, client.i18n.language);

    const authorAvatar = message.author.displayAvatarURL();
    const authorUsername = message.author.username;
    const searchResultEmbed = new EmbedBuilder()
      .setTitle(client.i18n.t("handlers.player.searchResult.searching"))
      .setDescription(
        client.i18n.t("handlers.player.searchResult.timer_choose"),
      )
      .setColor(Colors.Blue)
      .setTimestamp()
      .setAuthor({
        name: client.i18n.t("handlers.player.searchResult.tool_name"),
        iconURL:
          "https://support.content.office.net/th-th/media/e106d275-7ca7-4f1b-aea6-e592baf0db61.png",
      })
      .setFooter({ iconURL: authorAvatar, text: authorUsername })
      .setFields([
        {
          name: client.i18n.t("handlers.player.searchResult.title_results"),
          value: data,
        },
      ]);

    webhookLogEmbed
      .setColor(Colors.White)
      .setDescription(
        `Message:\`\`\`${message}\`\`\`\nResult:\`\`\`${result}\`\`\``,
      )
      .setFields([
        {
          name: "Event",
          value: "searchResult",
          inline: true,
        },
      ]);
    webhookSend(client.configs.logger.player, {
      embeds: [webhookLogEmbed],
    });
    message.channel.send({ embeds: [searchResultEmbed] });
  });
};
