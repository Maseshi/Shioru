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
    .setName("autoplay")
    .setDescription("Turn on / off automatic music playing")
    .setDescriptionLocalizations({ th: "เปิด/ปิดการเล่นเพลงอัตโนมัติ" })
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
        interaction.client.i18n.t("commands.autoplay.no_queue"),
      );
    const djDenial = getDjDenial(interaction, queue, {
      notOwner: "commands.autoplay.not_queue_owner",
      notDj: "commands.autoplay.not_a_dj",
    });

    if (djDenial)
      return await interaction.reply(interaction.client.i18n.t(djDenial));

    const mode = interaction.client.player.toggleAutoplay(interaction);

    await interaction.reply(
      mode
        ? interaction.client.i18n.t("commands.autoplay.on")
        : interaction.client.i18n.t("commands.autoplay.off"),
    );
  },
};
