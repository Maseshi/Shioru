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
    .setName("repeat")
    .setDescription("Toggle repeating playback mode.")
    .setDescriptionLocalizations({ th: "สลับโหมดของการเล่นเพลงซ้ำ" })
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
        .setName("mode")
        .setDescription("The mode to set the repeat to")
        .setDescriptionLocalizations({ th: "โหมดการตั้งค่าการทำซ้ำเป็น" })
        .setRequired(true)
        .addChoices(
          { name: "Disable", value: 0 },
          { name: "Repeat in Song", value: 1 },
          { name: "Repeat in Queue", value: 2 },
        )
        .setMinValue(0)
        .setMaxValue(2),
    ),
  async execute(interaction) {
    const inputMode = interaction.options.getInteger("mode");

    const queue = interaction.client.player.getQueue(interaction);

    if (!queue)
      return await interaction.reply(
        interaction.client.i18n.t("commands.repeat.no_queue"),
      );
    const djDenial = getDjDenial(interaction, queue, {
      notOwner: "commands.repeat.not_owner",
      notDj: "commands.repeat.not_a_dj",
    });

    if (djDenial)
      return await interaction.reply(interaction.client.i18n.t(djDenial));

    const mode = interaction.client.player.setRepeatMode(
      interaction,
      inputMode,
    );
    await interaction.reply(
      interaction.client.i18n.t("commands.repeat.repeated", {
        repeatMode: mode
          ? mode == 2
            ? interaction.client.i18n.t("commands.repeat.repeat_queue")
            : interaction.client.i18n.t("commands.repeat.repeat_song")
          : interaction.client.i18n.t("commands.repeat.off"),
      }),
    );
  },
};
