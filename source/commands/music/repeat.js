const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");

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

    const djs = interaction.client.configs.djs;
    const queue = interaction.client.player.getQueue(interaction);

    if (!queue)
      return await interaction.reply(
        interaction.client.i18n.t("commands.repeat.no_queue"),
      );
    if (djs.enable) {
      if (
        interaction.user.id !== queue.songs[0].user.id &&
        queue.autoplay === false
      )
        return await interaction.reply(
          interaction.client.i18n.t("commands.repeat.not_owner"),
        );
      if (
        djs.users.includes(interaction.user.id) &&
        djs.roles.includes(
          interaction.member.roles.cache.map((role) => role.id),
        ) &&
        djs.only
      )
        return await interaction.reply(
          interaction.client.i18n.t("commands.repeat.not_a_dj"),
        );
    }

    const mode = interaction.client.player.setRepeatMode(
      interaction,
      inputMode,
    );
    await interaction.reply(
      interaction.client.i18n
        .t("commands.repeat.repeated")
        .replace(
          "%s",
          mode
            ? mode == 2
              ? interaction.client.i18n.t("commands.repeat.repeat_queue")
              : interaction.client.i18n.t("commands.repeat.repeat_song")
            : interaction.client.i18n.t("commands.repeat.off"),
        ),
    );
  },
};
