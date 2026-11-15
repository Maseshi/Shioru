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
    .setName("shuffle")
    .setDescription("Shuffle queue")
    .setDescriptionLocalizations({ th: "สับเปลี่ยนในคิว" })
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
        interaction.client.i18n.t("commands.shuffle.no_queue"),
      );
    const djDenial = getDjDenial(interaction, queue, {
      notOwner: "commands.shuffle.not_owner",
      notDj: "commands.shuffle.not_a_dj",
    });

    if (djDenial)
      return await interaction.reply(interaction.client.i18n.t(djDenial));

    interaction.client.player.shuffle(interaction);
    await interaction.reply(
      interaction.client.i18n.t("commands.shuffle.now_shuffle"),
    );
  },
};
