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
    .setName("volume")
    .setDescription("Adjust the music volume")
    .setDescriptionLocalizations({ th: "ปรับระดับเสียงเพลง" })
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
        .setName("percent")
        .setDescription("Adjust the volume of the music from 0 to 100.")
        .setDescriptionLocalizations({
          th: "ปรับระดับเสียงของเพลงจาก 0 ถึง 100",
        })
        .setMinValue(0)
        .setMaxValue(100)
        .setRequired(false),
    ),
  async execute(interaction) {
    const inputPercent = interaction.options.getInteger("percent");

    const queue = interaction.client.player.getQueue(interaction);

    if (!queue)
      return await interaction.reply(
        interaction.client.i18n.t("commands.volume.no_queue"),
      );

    const queueVolume = queue.volume;

    const djDenial = getDjDenial(interaction, queue, {
      notOwner: "commands.volume.not_owner",
      notDj: "commands.volume.not_a_dj",
    });

    if (djDenial)
      return await interaction.reply(interaction.client.i18n.t(djDenial));
    if (inputPercent == null)
      return await interaction.reply(
        interaction.client.i18n.t("commands.volume.this_volume", {
          volume: queueVolume,
        }),
      );

    interaction.client.player.setVolume(interaction, inputPercent);
    await interaction.reply(
      interaction.client.i18n.t("commands.volume.adjusted", {
        volume: inputPercent,
      }),
    );
  },
};
