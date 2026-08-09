const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.GuildRoleUpdate,
  once: false,
  async execute(oldRole, newRole) {
    const roleUpdateEmbed = new EmbedBuilder()
      .setTitle(newRole.client.i18n.t("events.roleUpdate.role_notification"))
      .setDescription(
        newRole.client.i18n.t("events.roleUpdate.role_update", {
          oldRoleName: oldRole.name,
          newRoleId: newRole.id,
        }),
      )
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      newRole.client,
      newRole.guild,
      Events.GuildRoleUpdate,
      roleUpdateEmbed,
    );
  },
};
