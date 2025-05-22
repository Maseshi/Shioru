const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  InteractionContextType,
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
    ]),
  async execute(interaction) {
    const queue = interaction.client.player.getQueue(interaction);

    if (!queue) {
      return await interaction.reply(
        interaction.client.i18n.t("commands.queue.no_queue"),
      );
    }

    const currentSong = queue.songs[0];
    const queueAuthorUid = currentSong.user.id;
    const queueAuthorUsername = currentSong.user.username;
    const queueAuthorAvatar = currentSong.user.avatar;
    const avatarURL = `https://cdn.discordapp.com/avatars/${queueAuthorUid}/${queueAuthorAvatar}.webp`;

    const queueList = queue.songs
      .slice(1, 10)
      .map(
        (song, id) => `${id + 1}. ${song.name} - \`${song.formattedDuration}\``,
      )
      .join("\n");
    const queuePreviousList = queue.previousSongs
      .slice(0, 10)
      .map(
        (song, id) => `${id + 1}. ${song.name} - \`${song.formattedDuration}\``,
      )
      .join("\n");

    const duration = currentSong.stream?.playFromSource
      ? currentSong.duration
      : currentSong.stream?.song?.duration || currentSong.duration;
    const durationCurrent = queue.currentTime;
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
    const barIndex = Math.min(
      Math.floor(durationPercentage / 5),
      durationBars.length - 1,
    );
    const durationLine = durationBars[barIndex];

    const durationFormat = currentSong.formattedDuration;
    const durationCurrentFormat = queue.formattedCurrentTime;
    const durationCount = `${durationCurrentFormat} / ${durationFormat} \`${duration}\``;

    const musicPaused = interaction.client.player.paused ? "▶" : "▐▐";
    const musicAction = `◄◄⠀${musicPaused}⠀►►`;

    const musicVolume = queue.volume;
    const musicControl =
      musicVolume === 0
        ? "🔇 ○───"
        : musicVolume <= 30
          ? "🔈 ─○──"
          : musicVolume <= 70
            ? "🔉 ──○─"
            : "🔊 ───○";

    const musicRepeat =
      queue.repeatMode === 1 ? "🔁" : queue.repeatMode === 2 ? "🔂" : "";

    const musicAutoplay = queue.autoplay
      ? interaction.client.i18n.t("commands.queue.autoplay")
      : "";

    const musicFilter = queue.filters.names.length
      ? newLines(
          interaction.client.i18n.t("commands.queue.filter"),
          `\`\`\`${queue.filters.names.join(", ")}\`\`\``,
        )
      : "";

    const musicDisplay = newLines(
      durationLine,
      `${durationCount} ${musicAction} ${musicControl} \`${musicVolume}%\` ${musicRepeat}${musicAutoplay}`,
      musicFilter,
    );

    const descriptionParts = [musicDisplay];

    if (queue.songs.length > 1) {
      descriptionParts.push(
        "\n" + interaction.client.i18n.t("commands.queue.waiting_in_queue"),
        queueList,
      );
    }
    if (queue.previousSongs.length > 0) {
      descriptionParts.push(
        "\n" + interaction.client.i18n.t("commands.queue.previous_queue"),
        queuePreviousList,
      );
    }

    const queueEmbed = new EmbedBuilder()
      .setTitle(currentSong.name)
      .setURL(currentSong.url)
      .setDescription(descriptionParts.join("\n"))
      .setColor("Blue")
      .setThumbnail(currentSong.thumbnail)
      .setTimestamp(queue.createdTimestamp)
      .setFooter({
        text: interaction.client.i18n.t("commands.queue.owner_this_queue", {
          username: queueAuthorUsername,
        }),
        iconURL: avatarURL,
      });

    await interaction.reply({ embeds: [queueEmbed] });
  },
};
