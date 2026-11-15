const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.ThreadUpdate,
  once: false,
  async execute(oldThread, newThread) {
    const threadUpdateEmbed = new EmbedBuilder()
      .setTitle(
        newThread.client.i18n.t("events.threadUpdate.thread_notification"),
      )
      .setDescription(
        newThread.client.i18n.t("events.threadUpdate.thread_update", {
          oldThreadName: oldThread.name,
          newThreadId: newThread.id,
        }),
      )
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      newThread.client,
      newThread.guild,
      Events.ThreadUpdate,
      threadUpdateEmbed,
    );
  },
};
