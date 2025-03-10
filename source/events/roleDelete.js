const { Events, EmbedBuilder } = require("discord.js");
const {
	submitNotification,
	initializeData,
} = require("../utils/databaseUtils");

module.exports = {
	name: Events.GuildRoleDelete,
	once: false,
	async execute(role) {
		const roleDeleteEmbed = new EmbedBuilder()
			.setTitle(role.client.i18n.t("events.roleDelete.role_notification"))
			.setDescription(
				role.client.i18n
					.t("events.roleDelete.role_delete")
					.replace("%s", role.name),
			)
			.setTimestamp()
			.setColor("Yellow");

		await initializeData(role.client, role.guild);
		await submitNotification(
			role.client,
			role.guild,
			Events.GuildRoleDelete,
			roleDeleteEmbed,
		);
	},
};
