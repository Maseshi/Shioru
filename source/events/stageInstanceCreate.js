const { Events, EmbedBuilder } = require("discord.js");
const {
  submitNotification,
  initializeData,
} = require("../utils/databaseUtils");

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
        stageInstance.client.i18n
          .t("events.stageInstanceCreate.stage_instance_create")
          .replace("%s", stageInstance.id),
      )
      .setTimestamp()
      .setColor("Yellow");

    await initializeData(stageInstance.client, stageInstance.guild);
    await submitNotification(
      stageInstance.client,
      stageInstance.guild,
      Events.StageInstanceCreate,
      stageInstanceCreateEmbed,
    );
  },
};
