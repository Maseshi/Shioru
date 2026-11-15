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
    .setName("resume")
    .setDescription("Continue playing music from the beginning.")
    .setDescriptionLocalizations({ th: "เล่นเพลงต่อจากจุดเริ่มต้น" })
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
        interaction.client.i18n.t("commands.resume.no_queue"),
      );
    const djDenial = getDjDenial(interaction, queue, {
      notOwner: "commands.resume.not_owner",
      notDj: "commands.resume.not_a_dj",
    });

    if (djDenial)
      return await interaction.reply(interaction.client.i18n.t(djDenial));
    if (!queue.paused)
      return await interaction.reply(
        interaction.client.i18n.t("commands.resume.now_playing"),
      );

    interaction.client.player.resume(interaction);
    await interaction.reply(
      interaction.client.i18n.t("commands.resume.resumed"),
    );
  },
};
