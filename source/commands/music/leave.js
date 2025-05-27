const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");

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
    const djs = interaction.client.configs.djs;
    const queue = interaction.client.player.getQueue(interaction);

    const meChannel = interaction.guild.members.me.voice.channel;

    if (queue && djs.enable) {
      if (
        interaction.user.id !== queue.songs[0].user.id &&
        queue.autoplay === false
      )
        return await interaction.reply(
          interaction.client.i18n.t("commands.leave.another_player_is_playing"),
        );
      if (
        djs.users.includes(interaction.user.id) &&
        djs.roles.includes(
          interaction.member.roles.cache.map((role) => role.id),
        ) &&
        djs.only
      )
        return await interaction.reply(
          interaction.client.i18n.t("commands.leave.not_a_dj"),
        );
    }
    if (!meChannel)
      return await interaction.reply(
        interaction.client.i18n.t("commands.leave.not_in_any_channel"),
      );

    const connection = interaction.client.player.voices.get(meChannel.guild);

    connection.leave();
    await interaction.reply(
      interaction.client.i18n.t("commands.leave.now_leave"),
    );
  },
};
