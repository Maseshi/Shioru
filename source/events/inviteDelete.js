const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.InviteDelete,
  once: false,
  async execute(invite) {
    const inviteDeleteEmbed = new EmbedBuilder()
      .setTitle(invite.client.i18n.t("events.inviteDelete.invite_notification"))
      .setDescription(
        new Date().getTime() !== new Date(invite.expiresAt).getTime()
          ? invite.client.i18n.t("events.inviteDelete.invite_code_deleted", {
              inviteCode: invite.code,
            })
          : invite.client.i18n.t("events.inviteDelete.invite_code_expires", {
              inviteCode: invite.code,
            }),
      )
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      invite.client,
      invite.guild,
      Events.InviteDelete,
      inviteDeleteEmbed,
    );
  },
};
