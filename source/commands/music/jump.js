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
    .setName("jump")
    .setDescription("Skip to the selected queue number")
    .setDescriptionLocalizations({ th: "ข้ามไปยังหมายเลขคิวที่เลือก" })
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
        .setName("number")
        .setDescription("Number of songs to skip.")
        .setDescriptionLocalizations({ th: "หมายเลขของเพลงที่จะข้ามไป" })
        .setRequired(true)
        .setMinValue(1),
    ),
  async execute(interaction) {
    const inputAmount = interaction.options.getInteger("number");

    const queue = interaction.client.player.getQueue(interaction);

    if (!queue)
      return await interaction.reply(
        interaction.client.i18n.t("commands.jump.no_queue"),
      );
    const djDenial = getDjDenial(interaction, queue, {
      notOwner: "commands.jump.not_queue_owner",
      notDj: "commands.jump.not_a_dj",
    });

    if (djDenial)
      return await interaction.reply(interaction.client.i18n.t(djDenial));

    if (inputAmount > queue.songs.length)
      return await interaction.reply(
        interaction.client.i18n.t("commands.jump.too_much"),
      );

    try {
      interaction.client.player.jump(interaction, inputAmount);
      await interaction.reply(
        interaction.client.i18n.t("commands.jump.jumped", {
          queuePosition: inputAmount,
        }),
      );
    } catch (error) {
      await interaction.reply(
        interaction.client.i18n.t("commands.jump.can_not_jump"),
      );
    }
  },
};
