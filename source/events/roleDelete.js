const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.GuildRoleDelete,
  once: false,
  async execute(role) {
    const roleDeleteEmbed = new EmbedBuilder()
      .setTitle(role.client.i18n.t("events.roleDelete.role_notification"))
      .setDescription(
        role.client.i18n.t("events.roleDelete.role_delete", {
          roleName: role.name,
        }),
      )
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      role.client,
      role.guild,
      Events.GuildRoleDelete,
      roleDeleteEmbed,
    );
  },
};
