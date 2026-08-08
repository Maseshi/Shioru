const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../utils/databaseUtils");

module.exports = {
  name: Events.ThreadUpdate,
  once: false,
  async execute(oldThread, newThread) {
    const threadUpdateEmbed = new EmbedBuilder()
      .setTitle(
        newThread.client.i18n.t("events.threadUpdate.thread_notification"),
      )
      .setDescription(
        newThread.client.i18n
          .t("events.threadUpdate.thread_update")
          .replace("%s1", oldThread.name)
          .replace("%s2", newThread.id),
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
