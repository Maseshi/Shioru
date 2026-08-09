const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.ThreadDelete,
  once: false,
  async execute(thread) {
    const threadDeleteEmbed = new EmbedBuilder()
      .setTitle(thread.client.i18n.t("events.threadDelete.thread_notification"))
      .setDescription(
        thread.client.i18n.t("events.threadDelete.thread_delete", {
          threadName: thread.name,
        }),
      )
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      thread.client,
      thread.guild,
      Events.ThreadDelete,
      threadDeleteEmbed,
    );
  },
};
