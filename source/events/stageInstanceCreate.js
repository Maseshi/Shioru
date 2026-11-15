const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.StageInstanceCreate,
  once: false,
  async execute(stageInstance) {
    const stageInstanceCreateEmbed = new EmbedBuilder()
      .setTitle(
        stageInstance.client.i18n.t(
          "events.stageInstanceCreate.stage_notification",
        ),
      )
      .setDescription(
        stageInstance.client.i18n.t(
          "events.stageInstanceCreate.stage_instance_create",
          { stageId: stageInstance.id },
        ),
      )
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      stageInstance.client,
      stageInstance.guild,
      Events.StageInstanceCreate,
      stageInstanceCreateEmbed,
    );
  },
};
