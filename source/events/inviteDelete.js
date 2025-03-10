const { Events, EmbedBuilder } = require("discord.js");
const {
  submitNotification,
  initializeData,
} = require("../utils/databaseUtils");

module.exports = {
  name: Events.InviteDelete,
  once: false,
  async execute(invite) {
    const inviteDeleteEmbed = new EmbedBuilder()
      .setTitle(invite.client.i18n.t("events.inviteDelete.invite_notification"))
      .setDescription(
        new Date() !== new Date(invite.expiresAt)
          ? invite.client.i18n
              .t("events.inviteDelete.invite_code_deleted")
              .replace("%s", invite.code)
          : invite.client.i18n
              .t("events.inviteDelete.invite_code_expires")
              .replace("%s", invite.code),
      )
      .setTimestamp()
      .setColor("Yellow");

    await initializeData(invite.client, invite.guild);
    await submitNotification(
      invite.client,
      invite.guild,
      Events.InviteDelete,
      inviteDeleteEmbed,
    );
  },
};
