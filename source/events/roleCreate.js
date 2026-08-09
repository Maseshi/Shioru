const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.GuildRoleCreate,
  once: false,
  async execute(role) {
    const roleCreateEmbed = new EmbedBuilder()
      .setTitle(role.client.i18n.t("events.roleCreate.role_notification"))
      .setDescription(
        role.client.i18n.t("events.roleCreate.role_create", {
          roleId: role.id,
        }),
      )
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      role.client,
      role.guild,
      Events.GuildRoleCreate,
      roleCreateEmbed,
    );
  },
};
