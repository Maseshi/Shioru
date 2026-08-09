const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.GuildEmojiUpdate,
  once: false,
  async execute(oldEmoji, newEmoji) {
    const emojiUpdateEmbed = new EmbedBuilder()
      .setTitle(newEmoji.client.i18n.t("events.emojiUpdate.emoji_notification"))
      .setDescription(
        newEmoji.client.i18n.t("events.emojiUpdate.member_update_emoji", {
          oldEmojiName: oldEmoji.name,
          newEmojiName: newEmoji.name,
        }),
      )
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      newEmoji.client,
      newEmoji.guild,
      Events.GuildEmojiUpdate,
      emojiUpdateEmbed,
    );
  },
};
