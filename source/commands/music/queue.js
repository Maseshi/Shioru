const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  Colors,
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { newLines } = require("../../utils/miscUtils");

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Check songs in the queue")
    .setDescriptionLocalizations({ th: "ตรวจสอบเพลงในคิว" })
    .setDefaultMemberPermissions()
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ]),
  async execute(interaction) {
    const queue = interaction.client.player.getQueue(interaction);

    if (!queue) {
      return await interaction.reply(
        interaction.client.i18n.t("commands.queue.no_queue"),
      );
    }

    function controller(currentQueue) {
      const currentSong = currentQueue.songs[0];

      const duration = currentSong.stream?.playFromSource
        ? currentSong.duration
        : currentSong.stream?.song?.duration || currentSong.duration;
      const durationCurrent = currentQueue.currentTime;
      const durationPercentage = Math.round((durationCurrent / duration) * 100);
      const durationBars = [
        "🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
        "▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
        "▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
        "▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
        "▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
        "▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
        "▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬",
        "▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬",
        "▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬",
        "▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬",
        "▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬",
        "▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬",
        "▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬",
        "▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬",
        "▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬",
        "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬",
        "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬",
        "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬",
        "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬",
        "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘",
      ];
      const durationBarIndex = Math.min(
        Math.floor(durationPercentage / 5),
        durationBars.length - 1,
      );
      const durationLine = durationBars[durationBarIndex];

      const musicAction = currentQueue.paused ? "▶️" : "⏸️";

      const durationFormat = currentSong.formattedDuration;
      const durationCurrentFormat = currentQueue.formattedCurrentTime;
      const musicDuration = `${durationCurrentFormat} / ${durationFormat} \`${duration}\``;

      const volume = currentQueue.volume;
      const musicVolume =
        volume === 0
          ? "🔇 ○───"
          : volume <= 30
            ? "🔈 ─○──"
            : volume <= 70
              ? "🔉 ──○─"
              : "🔊 ───○";
      const musicVolumePercent = currentQueue.volume;

      const musicRepeat =
        currentQueue.repeatMode === 1
          ? "🔁"
          : currentQueue.repeatMode === 2
            ? "🔀"
            : "";

      const musicAutoplay = currentQueue.autoplay ? "📻" : "";

      const musicFilter = currentQueue.filters.names.length
        ? newLines(
            interaction.client.i18n.t("commands.queue.filter"),
            `\`\`\`${currentQueue.filters.names.join(", ")}\`\`\``,
          )
        : "";

      const musicDisplay = newLines(
        durationLine,
        `${musicAction} ${musicDuration} ${musicVolume} \`${musicVolumePercent}%\` ${musicRepeat}${musicAutoplay}`,
        musicFilter,
      );

      const queueList = currentQueue.songs
        .slice(1, 10)
        .map(
          (song, id) =>
            `${id + 1}. ${song.name} - \`${song.formattedDuration}\``,
        )
        .join("\n");
      const queuePreviousList = currentQueue.previousSongs
        .slice(0, 10)
        .map(
          (song, id) =>
            `${id + 1}. ${song.name} - \`${song.formattedDuration}\``,
        )
        .join("\n");

      const descriptionParts = [musicDisplay];

      if (currentQueue.songs.length > 1) {
        descriptionParts.push(
          "\n" + interaction.client.i18n.t("commands.queue.waiting_in_queue"),
          queueList,
        );
      }
      if (currentQueue.previousSongs.length > 0) {
        descriptionParts.push(
          "\n" + interaction.client.i18n.t("commands.queue.previous_queue"),
          queuePreviousList,
        );
      }

      const queueAuthorUid = currentSong.user.id;
      const queueAuthorUsername = currentSong.user.username;
      const queueAuthorAvatar = currentSong.user.avatar;
      const avatarURL = `https://cdn.discordapp.com/avatars/${queueAuthorUid}/${queueAuthorAvatar}.webp`;

      const queueEmbed = new EmbedBuilder()
        .setTitle(currentSong.name)
        .setURL(currentSong.url)
        .setDescription(descriptionParts.join("\n"))
        .setColor(Colors.Blue)
        .setThumbnail(currentSong.thumbnail)
        .setTimestamp(currentQueue.createdTimestamp)
        .setFooter({
          text: interaction.client.i18n.t("commands.queue.owner_this_queue", {
            username: queueAuthorUsername,
          }),
          iconURL: avatarURL,
        });

      const queueRow = new ActionRowBuilder();
      const repeatModes = [
        {
          emoji: "➡️",
          style: ButtonStyle.Secondary,
        },
        {
          emoji: "🔁",
          style: ButtonStyle.Primary,
        },
        {
          emoji: "🔀",
          style: ButtonStyle.Primary,
        },
      ];

      if (currentQueue.previousSongs.length > 0) {
        queueRow.addComponents(
          new ButtonBuilder()
            .setCustomId("music_previous")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("⏮️"),
        );
      }

      queueRow.addComponents(
        new ButtonBuilder()
          .setCustomId("music_play_pause")
          .setStyle(
            currentQueue.paused ? ButtonStyle.Secondary : ButtonStyle.Primary,
          )
          .setEmoji(currentQueue.paused ? "▶️" : "⏸️"),
        new ButtonBuilder()
          .setCustomId("music_stop")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("⏹️"),
        new ButtonBuilder()
          .setCustomId("music_skip")
          .setStyle(ButtonStyle.Primary)
          .setEmoji("⏭️"),
        new ButtonBuilder()
          .setCustomId("music_repeat")
          .setStyle(repeatModes[currentQueue.repeatMode].style)
          .setEmoji(repeatModes[currentQueue.repeatMode].emoji),
        new ButtonBuilder()
          .setCustomId("music_autoplay")
          .setStyle(
            !currentQueue.autoplay
              ? ButtonStyle.Secondary
              : ButtonStyle.Primary,
          )
          .setEmoji("📻"),
      );

      return { queueEmbed, queueRow };
    }

    const { queueEmbed, queueRow } = controller(queue);

    await interaction.reply({ embeds: [queueEmbed], components: [queueRow] });

    // Set collector timeout to match the queue's total duration (in ms), fallback to 60s if unavailable
    const queueDurationMs = (queue.duration || 60) * 1000;
    const collector = interaction.channel.createMessageComponentCollector({
      filter: (inter) => inter.user.id === interaction.user.id,
      time: queueDurationMs,
    });

    const updateEmbed = async () => {
      const currentQueue = interaction.client.player.getQueue(interaction);

      if (!currentQueue) return;

      const currentQueueDurationMs = (queue.duration || 60) * 1000;
      const { queueEmbed: updatedEmbed, queueRow: updatedRow } =
        controller(currentQueue);

      collector.resetTimer({ time: currentQueueDurationMs });

      try {
        await interaction.editReply({
          embeds: [updatedEmbed],
          components: [updatedRow],
        });
      } catch {
        // pass
      }
    };

    const player = interaction.client.player;
    const queueId = queue.id || interaction.guildId || interaction.channelId;
    // Update embed every 5 seconds
    const intervalId = setInterval(updateEmbed, 5000);

    const onFinishSong = async (currentQueue) => {
      if (
        (currentQueue.id ||
          currentQueue.guild?.id ||
          currentQueue.channel?.id) === queueId
      ) {
        await updateEmbed();
      }
    };
    const onAddSong = async (currentQueue) => {
      if (
        (currentQueue.id ||
          currentQueue.guild?.id ||
          currentQueue.channel?.id) === queueId
      ) {
        await updateEmbed();
      }
    };
    const onAddList = async (currentQueue) => {
      if (
        (currentQueue.id ||
          currentQueue.guild?.id ||
          currentQueue.channel?.id) === queueId
      ) {
        await updateEmbed();
      }
    };
    const onDeleteQueue = async (currentQueue) => {
      if (
        (currentQueue.id ||
          currentQueue.guild?.id ||
          currentQueue.channel?.id) === queueId
      ) {
        try {
          await interaction.editReply({ components: [] });
        } catch {
          // pass
        }
      }
    };
    const onFinish = async (currentQueue) => {
      if (
        (currentQueue.id ||
          currentQueue.guild?.id ||
          currentQueue.channel?.id) === queueId
      ) {
        await updateEmbed();
      }
    };

    player.on("finishSong", onFinishSong);
    player.on("addSong", onAddSong);
    player.on("addList", onAddList);
    player.on("deleteQueue", onDeleteQueue);
    player.on("finish", onFinish);

    collector.on("collect", async (inter) => {
      try {
        const currentQueue = interaction.client.player.getQueue(inter);

        if (!currentQueue) {
          await inter.reply({ content: "No queue found.", ephemeral: true });
          return;
        }

        switch (inter.customId) {
          case "music_previous": {
            if (currentQueue.previousSongs.length > 0) {
              await currentQueue.previous();
              await updateEmbed();
            } else {
              await inter.reply({
                content: "No previous song in history.",
                flags: MessageFlags.Ephemeral,
              });
            }
            break;
          }
          case "music_play_pause": {
            if (currentQueue.paused) {
              await currentQueue.resume();
            } else {
              await currentQueue.pause();
            }
            await updateEmbed();
            await inter.deferUpdate();
            break;
          }
          case "music_stop": {
            await currentQueue.stop();
            collector.stop();
            break;
          }
          case "music_skip": {
            if (currentQueue.songs.length > 1) {
              await currentQueue.skip();
              await updateEmbed();
              await inter.deferUpdate();
            } else {
              await inter.reply({
                content: "No next song to skip to.",
                flags: MessageFlags.Ephemeral,
              });
            }
            break;
          }
          case "music_repeat": {
            const nextRepeatMode = (currentQueue.repeatMode + 1) % 3;
            await currentQueue.setRepeatMode(nextRepeatMode);
            await updateEmbed();
            await inter.deferUpdate();
            break;
          }
          case "music_autoplay": {
            currentQueue.toggleAutoplay(!currentQueue.autoplay);
            await updateEmbed();
            await inter.deferUpdate();
            break;
          }
        }
      } catch (error) {
        await inter.reply({
          content: `⚠️ An error occurred:\n${error.message}`,
          flags: MessageFlags.Ephemeral,
        });
      }
    });
    collector.on("end", async () => {
      try {
        await interaction.editReply({ components: [] });
      } catch {
        // pass
      }

      // Remove listeners to prevent memory leaks
      player.off("finishSong", onFinishSong);
      player.off("addSong", onAddSong);
      player.off("addList", onAddList);
      player.off("deleteQueue", onDeleteQueue);
      player.off("finish", onFinish);

      // Clear interval to stop updating embeds
      if (intervalId) clearInterval(intervalId);
    });
  },
};
