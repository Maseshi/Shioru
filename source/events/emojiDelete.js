const { Events, EmbedBuilder } = require("discord.js");
const {
  submitNotification,
  initializeData,
} = require("../utils/databaseUtils");

module.exports = {
  name: Events.GuildEmojiDelete,
  once: false,
  async execute(emoji) {
    const emojiDeleteEmbed = new EmbedBuilder()
      .setTitle(emoji.client.i18n.t("events.emojiDelete.emoji_notification"))
      .setDescription(
        emoji.client.i18n
          .t("events.emojiDelete.member_delete_emoji")
          .replace("%s", emoji.name),
      )
      .setTimestamp()
      .setColor("Yellow");

    await initializeData(emoji.client, emoji.guild);
    await submitNotification(
      emoji.client,
      emoji.guild,
      Events.GuildEmojiDelete,
      emojiDeleteEmbed,
    );
  },
};
