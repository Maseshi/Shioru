const { Events, EmbedBuilder, Colors } = require("discord.js");
const {
  submitNotification,
  initializeData,
} = require("../utils/databaseUtils");

module.exports = {
  name: Events.ThreadMemberUpdate,
  once: false,
  async execute(oldMember, newMember) {
    const threadMemberUpdateEmbed = new EmbedBuilder()
      .setTitle(
        newMember.client.i18n.t(
          "events.threadMemberUpdate.thread_notification",
        ),
      )
      .setDescription(
        newMember.client.i18n.t(
          "events.threadMemberUpdate.thread_member_updated",
          {
            old_member: oldMember.thread.name,
            new_member: newMember.thread.id,
          },
        ),
      )
      .setTimestamp()
      .setColor(Colors.Blue);

    await initializeData(newMember.client, newMember.guild);
    await submitNotification(
      newMember.client,
      newMember.guild,
      module.exports.name,
      threadMemberUpdateEmbed,
    );
  },
};
