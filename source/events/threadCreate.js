const { Events, EmbedBuilder } = require("discord.js");
const {
  submitNotification,
  initializeData,
} = require("../utils/databaseUtils");

module.exports = {
  name: Events.ThreadCreate,
  once: false,
  async execute(thread, newlyCreated) {
    const threadCreateEmbed = new EmbedBuilder()
      .setTitle(thread.client.i18n.t("events.threadCreate.thread_notification"))
      .setDescription(
        thread.client.i18n
          .t("events.threadCreate.thread_create")
          .replace("%s", thread.id),
      )
      .setTimestamp()
      .setColor("Yellow");

    await initializeData(thread.client, thread.guild);
    await submitNotification(
      thread.client,
      thread.guild,
      Events.ThreadCreate,
      threadCreateEmbed,
    );
  },
};
