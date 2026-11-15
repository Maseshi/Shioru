const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const { getDjDenial } = require("../../services/music");

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Change the duration of the currently playing song")
    .setDescriptionLocalizations({
      th: "เปลี่ยนระยะเวลาของเพลงที่กำลังเล่นอยู่",
    })
    .setDefaultMemberPermissions()
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .addIntegerOption((option) =>
      option
        .setName("second")
        .setDescription("The time in seconds that you want to seek.")
        .setDescriptionLocalizations({
          th: "เวลาเป็นวินาทีที่คุณต้องการเปลี่ยนช่วง",
        })
        .setRequired(true)
        .setMinValue(0),
    ),
  async execute(interaction) {
    const inputSecond = interaction.options.getInteger("second");

    const queue = interaction.client.player.getQueue(interaction);

    if (!queue)
      return await interaction.reply(
        interaction.client.i18n.t("commands.seek.no_queue"),
      );

    const queueDuration = queue.songs[0].duration;
    const queueFormatDuration = queue.songs[0].formattedDuration;

    const djDenial = getDjDenial(interaction, queue, {
      notOwner: "commands.seek.not_owner",
      notDj: "commands.seek.not_a_dj",
    });

    if (djDenial)
      return await interaction.reply(interaction.client.i18n.t(djDenial));
    if (inputSecond == null)
      return await interaction.reply(
        interaction.client.i18n.t("commands.seek.seek_guide", {
          currentPosition: queueDuration,
        }),
      );
    if (inputSecond >= queueDuration)
      return await interaction.reply(
        interaction.client.i18n.t("commands.seek.too_much", {
          trackDuration: queueFormatDuration,
        }),
      );

    try {
      interaction.client.player.seek(interaction, inputSecond);
      await interaction.reply(
        interaction.client.i18n.t("commands.seek.sought"),
      );
    } catch {
      await interaction.reply(
        interaction.client.i18n.t("commands.seek.no_queue"),
      );
    }
  },
};
