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
    .setName("skip")
    .setDescription("Skip the currently playing song.")
    .setDescriptionLocalizations({ th: "ข้ามเพลงที่กำลังเล่นอยู่" })
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

    if (!queue)
      return await interaction.reply(
        interaction.client.i18n.t("commands.skip.no_queue"),
      );
    const djDenial = getDjDenial(interaction, queue, {
      notOwner: "commands.skip.not_owner",
      notDj: "commands.skip.not_a_dj",
    });

    if (djDenial)
      return await interaction.reply(interaction.client.i18n.t(djDenial));

    interaction.client.player.skip(interaction);
    await interaction.reply(interaction.client.i18n.t("commands.skip.skipped"));
  },
};
