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
    .setName("leave")
    .setDescription("Exits the current audio channel.")
    .setDescriptionLocalizations({ th: "ออกจากช่องสัญญาณเสียงปัจจุบัน" })
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

    const meChannel = interaction.guild.members.me.voice.channel;

    const djDenial = getDjDenial(interaction, queue, {
      notOwner: "commands.leave.another_player_is_playing",
      notDj: "commands.leave.not_a_dj",
    });

    if (djDenial)
      return await interaction.reply(interaction.client.i18n.t(djDenial));
    if (!meChannel)
      return await interaction.reply(
        interaction.client.i18n.t("commands.leave.not_in_any_channel"),
      );

    const connection = interaction.client.player.voices.get(meChannel.guild);

    if (!connection)
      return await interaction.reply(
        interaction.client.i18n.t("commands.leave.not_in_any_channel"),
      );

    connection.leave();
    await interaction.reply(
      interaction.client.i18n.t("commands.leave.now_leave"),
    );
  },
};
