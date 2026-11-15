const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.ThreadCreate,
  once: false,
  async execute(thread, _newlyCreated) {
    const threadCreateEmbed = new EmbedBuilder()
      .setTitle(thread.client.i18n.t("events.threadCreate.thread_notification"))
      .setDescription(
        thread.client.i18n.t("events.threadCreate.thread_create", {
          threadId: thread.id,
        }),
      )
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      thread.client,
      thread.guild,
      Events.ThreadCreate,
      threadCreateEmbed,
    );
  },
};
