const { ChannelType, InteractionType } = require("discord.js");
const { getDatabase, ref, update, get } = require("firebase/database");
const { permissions } = require("../../utils/clientUtils");
const { catchError } = require("../../utils/consoleUtils");

module.exports = async (client, interaction) => {
	if (interaction.channel.type === ChannelType.DM) return;
	if (interaction.type !== InteractionType.ApplicationCommand) return;

	const command = client.interaction.get(interaction.commandName);

	if (!command) return;

	// Check that members have the permissions to use the application or not.
	if (!interaction.member.permissions.has("USE_APPLICATION_COMMANDS")) {
		return await interaction.reply(client.translate.events.interactionCreate.no_permission);
	}

	if (command.permissions) {
		// Check the permissions of the command for the user.
		if (command.permissions.user) {
			if (!interaction.member.permissions.has(command.permissions.user)) {
				return await interaction.reply(client.translate.events.interactionCreate.user_is_not_allowed).replace("%s", command.permissions.user.map(permission => permissions[permission]).join(", "));
			}
		}

		// Check the permissions of the command for the bot.
		if (command.permissions.client) {
			if (!interaction.guild.members.me.permissions.has(command.permissions.client)) {
				return await interaction.reply(client.translate.events.interactionCreate.client_is_not_allowed).replace("%s", command.permissions.client.map(permission => permissions[permission]).join(", "));
			}
		}
	}
	if (!command.interaction.enable) return message.reply(client.translate.events.messageCreate.command_is_disabled);

	await interaction.deferReply();

	try {
		await command.interaction.execute(interaction);

		// Stores information when the bot is working properly.
		if (client.mode === "start") {
			get(ref(getDatabase(), "Shioru/data/survey")).then((snapshot) => {
				if (snapshot.exists()) {
					let working = snapshot.val().working;

					update(ref(getDatabase(), "Shioru/data/survey"), {
						"working": (working + 1)
					});
				} else {
					update(ref(getDatabase(), "Shioru/data/survey"), {
						"working": 1
					});
				}
			});
		}
	} catch (error) {
		catchError(client, interaction, interaction.commandName, error);
	}
}