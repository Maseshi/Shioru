const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const { YouTubePlugin, SearchResultType } = require("@distube/youtube");
const { SoundCloudPlugin, SearchType } = require("@distube/soundcloud");
const { catchError } = require("../../utils/consoleUtils");

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.Connect,
    PermissionFlagsBits.Speak,
  ],
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("Create or add a playlist of songs.")
    .setDescriptionLocalizations({ th: "สร้างหรือเพิ่มเพลย์ลิสต์ของเพลง" })
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect)
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .addStringOption((option) =>
      option
        .setName("links")
        .setDescription(
          'The playlist links you want, separated by "," for each one.',
        )
        .setDescriptionLocalizations({
          th: 'ลิงค์ของเพลย์ลิสต์ที่คุณต้องการคั่นด้วย "," สำหรับแต่ละรายการ',
        })
        .setAutocomplete(true)
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Set the name of the playlist.")
        .setDescriptionLocalizations({ th: "ตั้งชื่อของเพลย์ลิสต์" }),
    )
    .addBooleanOption((option) =>
      option
        .setName("skip")
        .setDescription(
          "Immediately skip the currently playing song (if it exists) and play the added song.",
        )
        .setDescriptionLocalizations({
          th: "ข้ามเพลงที่เล่นอยู่ทันที (หากมีอยู่) และเล่นเพลงที่เพิ่มมา",
        }),
    )
    .addIntegerOption((option) =>
      option
        .setName("position")
        .setDescription(
          "The position of the playlist to be inserted or added, starting from zero.",
        )
        .setDescriptionLocalizations({
          th: "ตำแหน่งของเพลย์ลิสต์ที่ต้องการแทรกหรือเพิ่มโดยเริ่มต้นนับจากศูนย์",
        }),
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel that wants her to play music.")
        .setDescriptionLocalizations({ th: "ช่องที่ต้องการให้เธอเล่นเพลง" })
        .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice),
    ),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();

    if (!focusedValue) return interaction.respond([]);

    const youtubePlugin = new YouTubePlugin();
    const soundCloudPlugin = new SoundCloudPlugin();

    const [youtubeResults, soundCloudResults] = await Promise.all([
      youtubePlugin.search(focusedValue, {
        type: SearchResultType.PLAYLIST,
        limit: 10,
        safeSearch: true,
      }),
      soundCloudPlugin.search(focusedValue, SearchType.Playlist, 10),
    ]);

    // Combine results by matching names, prefer SoundCloud source
    const soundCloudNames = new Set(
      soundCloudResults.map((result) => result.name.toLowerCase()),
    );
    const combined = [
      ...soundCloudResults,
      ...youtubeResults.filter(
        (result) => !soundCloudNames.has(result.name.toLowerCase()),
      ),
    ];

    if (!combined.length) return interaction.respond([]);

    await interaction.respond(
      combined.map((choice) => {
        const name =
          choice.name.length > 100
            ? choice.name.slice(0, 97) + "..."
            : choice.name;
        const value = choice.url.length > 100 ? name : choice.url;
        return { name, value };
      }),
    );
  },
  async execute(interaction) {
    const inputLinks = interaction.options.getString("links");
    const inputName =
      interaction.options.getString("name") ??
      interaction.client.i18n.t("commands.playlist.playlist_of_user", {
        id: interaction.user.id,
      });
    const inputSkip = interaction.options.getBoolean("skip") ?? false;
    const inputPosition = interaction.options.getInteger("position") ?? 0;
    const inputChannel = interaction.options.getChannel("channel") ?? "";

    const djs = interaction.client.configs.djs;
    const queue = interaction.client.player.getQueue(interaction);
    const voiceChannel = interaction.member.voice.channel;
    const meChannel = interaction.guild.members.me.voice.channel;
    const filteredLinks = inputLinks
      .split(",")
      .map((song) => song.trim())
      .filter(Boolean);

    if (queue && djs.enable) {
      if (
        interaction.user.id !== queue.songs[0].user.id &&
        queue.autoplay === false
      )
        return await interaction.reply(
          interaction.client.i18n.t("commands.playlist.not_owner"),
        );
      if (
        djs.users.includes(interaction.user.id) &&
        djs.roles.includes(
          interaction.member.roles.cache.map((role) => role.id),
        ) &&
        djs.only
      )
        return await interaction.reply(
          interaction.client.i18n.t("commands.playlist.not_a_dj"),
        );
    }
    if (!queue && (inputSkip || inputPosition))
      return await interaction.reply(
        interaction.client.i18n.t("commands.playlist.no_queue"),
      );
    if (!inputChannel && !voiceChannel && !meChannel)
      return await interaction.reply(
        interaction.client.i18n.t("commands.playlist.not_in_channel"),
      );
    if (!filteredLinks.length)
      return await interaction.reply(
        interaction.client.i18n.t("commands.playlist.need_for_link"),
      );

    await interaction.deferReply();

    try {
      const playlist = await interaction.client.player.createCustomPlaylist(
        filteredLinks,
        {
          member: interaction.member,
          name: inputName,
          parallel: true,
        },
      );

      await interaction.client.player.play(
        voiceChannel || inputChannel || meChannel,
        playlist,
        {
          member: interaction.member,
          message: false,
          skip: inputSkip,
          position: inputPosition,
          textChannel: interaction.channel,
        },
      );
      await interaction.deleteReply();
    } catch (error) {
      if (error.code === "VOICE_CONNECT_FAILED")
        return await interaction.editReply(
          interaction.client.i18n.t("commands.playlist.can_not_connect"),
        );
      if (error.code === "NON_NSFW")
        return await interaction.editReply(
          interaction.client.i18n.t(
            "commands.playlist.can_not_play_in_non_nsfw",
          ),
        );
      if (error.code === "NO_VALID_SONG")
        return await interaction.editReply(
          interaction.client.i18n.t("commands.playlist.no_valid_song"),
        );
      if (error.code === "EMPTY_PLAYLIST")
        return await interaction.editReply(
          interaction.client.i18n.t("commands.playlist.empty_playlist"),
        );
      if (!queue && meChannel) {
        const connection = interaction.client.player.voices.get(meChannel);

        connection.leave();
      }

      catchError(
        interaction.client,
        interaction,
        module.exports.data.name,
        error,
      );
    }
  },
};
