const { Events, EmbedBuilder } = require("discord.js");
const {
  submitNotification,
  initializeData,
} = require("../utils/databaseUtils");

module.exports = {
  name: Events.GuildEmojiCreate,
  once: false,
  async execute(emoji) {
    const emojiCreateEmbed = new EmbedBuilder()
      .setTitle(emoji.client.i18n.t("events.emojiCreate.emoji_notification"))
      .setDescription(
        emoji.client.i18n
          .t("events.emojiCreate.member_create_emoji")
          .replace("%s", emoji.name),
      )
      .setTimestamp()
      .setColor("Yellow");

    await initializeData(emoji.client, emoji.guild);
    await submitNotification(
      emoji.client,
      emoji.guild,
      Events.GuildEmojiCreate,
      emojiCreateEmbed,
    );
  },
};
