const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.GuildStickerDelete,
  once: false,
  async execute(sticker) {
    const stickerDeleteEmbed = new EmbedBuilder()
      .setTitle(
        sticker.client.i18n.t("events.stickerDelete.sticker_notification"),
      )
      .setDescription(
        sticker.client.i18n.t("events.stickerDelete.sticker_delete", {
          stickerName: sticker.name,
        }),
      )
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      sticker.client,
      sticker.guild,
      Events.GuildStickerDelete,
      stickerDeleteEmbed,
    );
  },
};
