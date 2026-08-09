const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.StageInstanceUpdate,
  once: false,
  async execute(oldStageInstance, newStageInstance) {
    const stageInstanceUpdateEmbed = new EmbedBuilder()
      .setTitle(
        newStageInstance.client.i18n.t(
          "events.stageInstanceUpdate.stage_notification",
        ),
      )
      .setDescription(
        newStageInstance.client.i18n.t(
          "events.stageInstanceUpdate.stage_instance_update",
          {
            oldStageName: oldStageInstance.name,
            newStageId: newStageInstance.id,
          },
        ),
      )
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      newStageInstance.client,
      newStageInstance.guild,
      Events.StageInstanceUpdate,
      stageInstanceUpdateEmbed,
    );
  },
};
