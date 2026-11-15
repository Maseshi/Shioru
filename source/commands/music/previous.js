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
    .setName("previous")
    .setDescription("Return to the previous song.")
    .setDescriptionLocalizations({ th: "กลับไปยังเพลงก่อนหน้านี้" })
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
        interaction.client.i18n.t("commands.previous.no_queue"),
      );
    const djDenial = getDjDenial(interaction, queue, {
      notOwner: "commands.previous.not_owner",
      notDj: "commands.previous.not_a_dj",
    });

    if (djDenial)
      return await interaction.reply(interaction.client.i18n.t(djDenial));
    if (!queue.previousSongs)
      return await interaction.reply(
        interaction.client.i18n.t("commands.previous.no_previous_song_queue"),
      );

    interaction.client.player.previous(interaction);
    await interaction.reply(
      interaction.client.i18n.t("commands.previous.previous"),
    );
  },
};
