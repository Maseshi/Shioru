const { Events, EmbedBuilder, StickerFormatType } = require("discord.js");
const {
  submitNotification,
  initializeData,
} = require("../utils/databaseUtils");

module.exports = {
  name: Events.GuildStickerCreate,
  once: false,
  async execute(sticker) {
    const stickerCreateEmbed = new EmbedBuilder()
      .setTitle(
        sticker.client.i18n.t("events.stickerCreate.sticker_notification"),
      )
      .setDescription(
        sticker.client.i18n
          .t("events.stickerCreate.sticker_create")
          .replace("%s", sticker.name),
      )
      .setThumbnail(
        sticker.format !== StickerFormatType.Lottie ? sticker.url : "",
      )
      .setTimestamp()
      .setColor("Yellow");

    await initializeData(sticker.client, sticker.guild);
    await submitNotification(
      sticker.client,
      sticker.guild,
      Events.GuildStickerCreate,
      stickerCreateEmbed,
    );
  },
};
