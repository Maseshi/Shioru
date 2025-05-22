const { Events, EmbedBuilder, Colors } = require("discord.js");
const {
  submitNotification,
  initializeData,
} = require("../utils/databaseUtils");

module.exports = {
  name: Events.ThreadMembersUpdate,
  once: false,
  async execute(addedMembers, removedMembers, thread) {
    await initializeData(thread.client, thread.guild);

    if (addedMembers.size) {
      const threadMembersUpdateAddedEmbed = new EmbedBuilder()
        .setTitle(
          thread.client.i18n.t(
            "events.threadMembersUpdate.thread_notification",
          ),
        )
        .setDescription(
          thread.client.i18n.t(
            "events.threadMembersUpdate.added_thread_members",
            {
              thread_id: thread.id,
              count: addedMembers.size,
            },
          ),
        )
        .setImage(thread.guild.bannerURL())
        .setTimestamp()
        .setColor(Colors.Blue);

      await submitNotification(
        thread.client,
        thread.guild,
        module.exports.name,
        threadMembersUpdateAddedEmbed,
      );
    }
    if (removedMembers.size) {
      const threadMembersUpdateRemovedEmbed = new EmbedBuilder()
        .setTitle(
          thread.client.i18n.t(
            "events.threadMembersUpdate.thread_notification",
          ),
        )
        .setDescription(
          thread.client.i18n.t(
            "events.threadMembersUpdate.removed_thread_members",
            {
              thread_id: thread.id,
              count: removedMembers.size,
            },
          ),
        )
        .setImage(thread.guild.bannerURL())
        .setTimestamp()
        .setColor(Colors.Blue);

      await submitNotification(
        thread.client,
        thread.guild,
        module.exports.name,
        threadMembersUpdateRemovedEmbed,
      );
    }
  },
};
