const { Events, EmbedBuilder, StickerFormatType } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.GuildStickerCreate,
  once: false,
  async execute(sticker) {
    const stickerCreateEmbed = new EmbedBuilder()
      .setTitle(
        sticker.client.i18n.t("events.stickerCreate.sticker_notification"),
      )
      .setDescription(
        sticker.client.i18n.t("events.stickerCreate.sticker_create", {
          stickerName: sticker.name,
        }),
      )
      .setThumbnail(
        sticker.format !== StickerFormatType.Lottie ? sticker.url : "",
      )
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      sticker.client,
      sticker.guild,
      Events.GuildStickerCreate,
      stickerCreateEmbed,
    );
  },
};
