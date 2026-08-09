const { Events, EmbedBuilder, Colors } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.ThreadListSync,
  once: false,
  async execute(threads, guild) {
    const threadCreateEmbed = new EmbedBuilder()
      .setTitle(
        guild.client.i18n.t("events.threadListSync.thread_notification"),
      )
      .setDescription(
        guild.client.i18n.t("events.threadListSync.thread_list_synced", {
          count: threads.size,
        }),
      )
      .setTimestamp()
      .setColor(Colors.Blue);

    await submitNotification(
      guild.client,
      guild,
      module.exports.name,
      threadCreateEmbed,
    );
  },
};
