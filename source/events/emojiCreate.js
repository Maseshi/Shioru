const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.GuildEmojiCreate,
  once: false,
  async execute(emoji) {
    const emojiCreateEmbed = new EmbedBuilder()
      .setTitle(emoji.client.i18n.t("events.emojiCreate.emoji_notification"))
      .setDescription(
        emoji.client.i18n.t("events.emojiCreate.member_create_emoji", {
          emojiName: emoji.name,
        }),
      )
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      emoji.client,
      emoji.guild,
      Events.GuildEmojiCreate,
      emojiCreateEmbed,
    );
  },
};
