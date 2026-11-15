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
    .setName("stop")
    .setDescription("Stop playing current song")
    .setDescriptionLocalizations({ th: "หยุดเล่นเพลงปัจจุบัน" })
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
        interaction.client.i18n.t("commands.stop.no_queue"),
      );
    const djDenial = getDjDenial(interaction, queue, {
      notOwner: "commands.stop.not_owner",
      notDj: "commands.stop.not_a_dj",
    });

    if (djDenial)
      return await interaction.reply(interaction.client.i18n.t(djDenial));

    interaction.client.player.stop(interaction);
    await interaction.reply(interaction.client.i18n.t("commands.stop.stopped"));
  },
};
