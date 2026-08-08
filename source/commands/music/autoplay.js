const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");

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
    const djs = require("../../utils/cacheUtils").getGuildDjs(
      interaction.client,
      interaction.guildId,
    );
    const queue = interaction.client.player.getQueue(interaction);

    if (!queue)
      return await interaction.reply(
        interaction.client.i18n.t("commands.autoplay.no_queue"),
      );
    if (djs.enable) {
      if (interaction.user.id !== queue.songs[0].user.id && !queue.autoplay)
        return await interaction.reply(
          interaction.client.i18n.t("commands.autoplay.not_queue_owner"),
        );
      if (
        !djs.users.includes(interaction.user.id) &&
        !interaction.member.roles.cache.some((role) =>
          djs.roles.includes(role.id),
        ) &&
        djs.only
      )
        return await interaction.reply(
          interaction.client.i18n.t("commands.autoplay.not_a_dj"),
        );
    }

    const mode = interaction.client.player.toggleAutoplay(interaction);

    await interaction.reply(
      mode
        ? interaction.client.i18n.t("commands.autoplay.on")
        : interaction.client.i18n.t("commands.autoplay.off"),
    );
  },
};
