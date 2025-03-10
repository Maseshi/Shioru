const { Events, EmbedBuilder } = require("discord.js");
const {
  submitNotification,
  initializeData,
} = require("../utils/databaseUtils");

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
        newStageInstance.client.i18n
          .t("events.stageInstanceUpdate.stage_instance_update")
          .replace("%s1", oldStageInstance.name)
          .replace("%s2", newStageInstance.id),
      )
      .setTimestamp()
      .setColor("Yellow");

    await initializeData(newStageInstance.client, newStageInstance.guild);
    await submitNotification(
      newStageInstance.client,
      newStageInstance.guild,
      Events.StageInstanceUpdate,
      stageInstanceUpdateEmbed,
    );
  },
};
