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
    .setName("remove")
    .setDescription("Remove song from the queue")
    .setDescriptionLocalizations({ th: "ลบเพลงออกจากคิว" })
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
        .setDescription("The number of songs to be deleted.")
        .setDescriptionLocalizations({ th: "หมายเลขของเพลงที่ต้องการจะลบ" })
        .setRequired(true)
        .setMinValue(1),
    ),
  async execute(interaction) {
    const inputAmount = interaction.options.getInteger("number");

    const queue = interaction.client.player.getQueue(interaction);

    if (!queue)
      return await interaction.reply(
        interaction.client.i18n.t("commands.remove.no_queue"),
      );
    const djDenial = getDjDenial(interaction, queue, {
      notOwner: "commands.remove.not_owner",
      notDj: "commands.remove.not_a_dj",
    });

    if (djDenial)
      return await interaction.reply(interaction.client.i18n.t(djDenial));
    if (inputAmount >= queue.songs.length)
      return await interaction.reply(
        interaction.client.i18n.t("commands.remove.too_much"),
      );

    const song = queue.songs.splice(inputAmount, 1);
    await interaction.reply(
      interaction.client.i18n.t("commands.remove.removed", {
        songName: song[0].name,
      }),
    );
  },
};
