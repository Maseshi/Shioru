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
    .setName("related")
    .setDescription("Songs related to the currently playing song")
    .setDescriptionLocalizations({ th: "เพลงที่เกี่ยวข้องกับเพลงที่เล่นอยู่" })
    .setDefaultMemberPermissions()
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .addSubcommand((option) =>
      option
        .setName("add")
        .setDescription("Add related songs to the queue.")
        .setDescriptionLocalizations({ th: "เพิ่มเพลงที่เกี่ยวข้องลงในคิว." }),
    ),
  async execute(interaction) {
    const queue = interaction.client.player.getQueue(interaction);

    if (!queue)
      return await interaction.reply(
        interaction.client.i18n.t("commands.related.no_queue"),
      );
    const djDenial = getDjDenial(interaction, queue, {
      notOwner: "commands.related.not_queue_owner",
      notDj: "commands.related.not_a_dj",
    });

    if (djDenial)
      return await interaction.reply(interaction.client.i18n.t(djDenial));

    const relatedSong = await interaction.client.player.addRelatedSong(
      interaction.guild,
    );

    await interaction.reply(
      interaction.client.i18n.t("commands.related.added_related_song", {
        name: relatedSong.name,
        duration: relatedSong.formattedDuration,
      }),
    );
  },
};
