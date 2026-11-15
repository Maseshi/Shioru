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
    .setName("pause")
    .setDescription("Temporarily stop playing songs in the queue.")
    .setDescriptionLocalizations({ th: "หยุดเล่นเพลงในคิวชั่วคราว" })
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
        interaction.client.i18n.t("commands.pause.no_queue"),
      );
    const djDenial = getDjDenial(interaction, queue, {
      notOwner: "commands.pause.not_owner",
      notDj: "commands.pause.not_a_dj",
    });

    if (djDenial)
      return await interaction.reply(interaction.client.i18n.t(djDenial));
    if (queue.paused)
      return await interaction.reply(
        interaction.client.i18n.t("commands.pause.not_paused"),
      );

    interaction.client.player.pause(interaction);
    await interaction.reply(interaction.client.i18n.t("commands.pause.paused"));
  },
};
