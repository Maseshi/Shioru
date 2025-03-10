const { Events, EmbedBuilder } = require("discord.js");
const {
	submitNotification,
	initializeData,
} = require("../utils/databaseUtils");

module.exports = {
	name: Events.GuildRoleUpdate,
	once: false,
	async execute(oldRole, newRole) {
		const roleUpdateEmbed = new EmbedBuilder()
			.setTitle(newRole.client.i18n.t("events.roleUpdate.role_notification"))
			.setDescription(
				newRole.client.i18n
					.t("events.roleUpdate.role_update")
					.replace("%s1", oldRole.name)
					.replace("%s2", newRole.id),
			)
			.setTimestamp()
			.setColor("Yellow");

		await initializeData(newRole.client, newRole.guild);
		await submitNotification(
			newRole.client,
			newRole.guild,
			Events.GuildRoleUpdate,
			roleUpdateEmbed,
		);
	},
};
