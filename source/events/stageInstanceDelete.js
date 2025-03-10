const { Events, EmbedBuilder } = require("discord.js");
const {
	submitNotification,
	initializeData,
} = require("../utils/databaseUtils");

module.exports = {
	name: Events.StageInstanceDelete,
	once: false,
	async execute(stageInstance) {
		const stageInstanceDeleteEmbed = new EmbedBuilder()
			.setTitle(
				stageInstance.client.i18n.t(
					"events.stageInstanceDelete.stage_notification",
				),
			)
			.setDescription(
				stageInstance.client.i18n
					.t("events.stageInstanceDelete.stage_instance_delete")
					.replace("%s", stageInstance.name),
			)
			.setTimestamp()
			.setColor("Yellow");

		await initializeData(stageInstance.client, stageInstance.guild);
		await submitNotification(
			stageInstance.client,
			stageInstance.guild,
			Events.StageInstanceDelete,
			stageInstanceDeleteEmbed,
		);
	},
};
