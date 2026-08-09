const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.InviteCreate,
  once: false,
  async execute(invite) {
    const inviteCreateEmbed = new EmbedBuilder()
      .setTitle(invite.client.i18n.t("events.inviteCreate.invite_notification"))
      .setDescription(
        invite.client.i18n.t("events.inviteCreate.invite_create", {
          inviteUrl: invite.url,
          expiresAt: invite.expiresAt,
          maxUses: invite.maxUses,
          inviteCode: invite.code,
        }),
      )
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      invite.client,
      invite.guild,
      Events.InviteCreate,
      inviteCreateEmbed,
    );
  },
};
