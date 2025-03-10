const { Events, EmbedBuilder } = require("discord.js");
const {
	submitNotification,
	initializeData,
} = require("../utils/databaseUtils");

module.exports = {
	name: Events.GuildRoleCreate,
	once: false,
	async execute(role) {
		const roleCreateEmbed = new EmbedBuilder()
			.setTitle(role.client.i18n.t("events.roleCreate.role_notification"))
			.setDescription(
				role.client.i18n
					.t("events.roleCreate.role_create")
					.replace("%s", role.id),
			)
			.setTimestamp()
			.setColor("Yellow");

		await initializeData(role.client, role.guild);
		await submitNotification(
			role.client,
			role.guild,
			Events.GuildRoleCreate,
			roleCreateEmbed,
		);
	},
};
