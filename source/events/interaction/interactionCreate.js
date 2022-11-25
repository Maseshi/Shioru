const { ChannelType, PermissionsBitField } = require("discord.js");
const { getDatabase, ref, child, set, increment } = require("firebase/database");
const { BitwisePermissionFlags } = require("../../utils/clientUtils");
const { catchError } = require("../../utils/consoleUtils");

module.exports = async (client, interaction) => {
	if (interaction.user.bot) return;
	if (interaction.channel.type === ChannelType.DM) return;

	const command = client.interaction.get(interaction.commandName);

	if (!command) return;

	// Check that members have the permissions to use the application or not.
	if (!interaction.member.permissions.has(PermissionsBitField.Flags.UseApplicationCommands)) {
		return await interaction.reply(client.translate.events.interactionCreate.no_permission);
	}

	if (command.permissions) {
		// Check the permissions of the command for the user.
		if (command.permissions.user) {
			if (!interaction.member.permissions.has(command.permissions.user)) {
				try {
					return await interaction.reply(client.translate.events.interactionCreate.user_is_not_allowed).replace("%s", command.permissions.user.map(permission => BitwisePermissionFlags[permission]).join(", "));
				} catch {
					return;
				}
			}
		}

		// Check the permissions of the command for the bot.
		if (command.permissions.client) {
			if (!interaction.guild.members.me.permissions.has(command.permissions.client)) {
				try {
					return await interaction.member.send(client.translate.events.interactionCreate.client_is_not_allowed).replace("%s", command.permissions.client.map(permission => BitwisePermissionFlags[permission]).join(", "));
				} catch {
					return;
				}
			}
		}
	}

	if (interaction.isChatInputCommand()) {
		await interaction.deferReply();

		try {
			await command.interaction.slash.execute(interaction);

			// Stores information when the bot is working properly.
			if (client.mode === "start") {
				set(ref(getDatabase(), "statistics/shioru/size/worked"), increment(1) || 1);
				set(child(ref(getDatabase(), "statistics/shioru/slash"), command.name), increment(1) || 1);
			}
		} catch (error) {
			catchError(client, interaction, interaction.commandName, error);
		}
	}
	if (interaction.isMessageContextMenuCommand()) {
		await interaction.deferReply({ "ephemeral": true });
		
		try {
			await command.interaction.context.execute(interaction);

			// Stores information when the bot is working properly.
			if (client.mode === "start") {
				set(ref(getDatabase(), "statistics/shioru/size/worked"), increment(1) || 1);
				set(child(ref(getDatabase(), "statistics/shioru/context"), command.name), increment(1) || 1);
			}
		} catch (error) {
			catchError(client, interaction, interaction.commandName, error);
		}
	}
}