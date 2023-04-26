const { Events, ChannelType, PermissionsBitField } = require("discord.js");
const { getDatabase, ref, child, set, increment } = require("firebase/database");
const { BitwisePermissionFlags } = require("../utils/clientUtils");
const { catchError } = require("../utils/consoleUtils");
const { levelSystem, settingsData } = require("../utils/databaseUtils");

module.exports = {
	"name": Events.InteractionCreate,
	"once": false,
	async execute(interaction) {
		if (interaction.user.bot) return;
		if (interaction.channel.type === ChannelType.DM) return;

		// Check permissions for application commands before working them.
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.UseApplicationCommands)) {
			return await interaction.reply({ "content": interaction.client.translate.events.interactionCreate.no_permission, "ephemeral": true });
		}

		// Automatic settings data on database
		if (interaction.client.mode === "start") {
			settingsData(interaction.client, interaction.guild);
			levelSystem(interaction.client, interaction, "POST", { "amount": 123, "type": "exp" });
		}

		// Get command when has interaction
		const commandName = interaction.commandName;
		const command = interaction.client.commands.get(commandName);

		if (command.permissions) {
			// Check the permissions of the command for the user.
			if (command.permissions.user) {
				if (!interaction.member.permissions.has(command.permissions.user)) {
					try {
						return await interaction.reply({ "content": interaction.client.translate.events.interactionCreate.user_is_not_allowed.replace("%s", command.permissions.user.map(permission => BitwisePermissionFlags[permission]).join(", ")), "ephemeral": true });
					} catch (error) {
						return catchError(interaction.client, interaction, interaction.commandName, "interactionCreate", error, true);
					}
				}
			}

			// Check the permissions of the command for the bot.
			if (command.permissions.client) {
				if (!interaction.guild.members.me.permissions.has(command.permissions.client)) {
					try {
						return await interaction.member.send({ "content": interaction.client.translate.events.interactionCreate.client_is_not_allowed.replace("%s", command.permissions.client.map(permission => BitwisePermissionFlags[permission]).join(", ")), "ephemeral": true });
					} catch (error) {
						return catchError(interaction.client, interaction, interaction.commandName, "interactionCreate", error, true);
					}
				}
			}
		}

		// When user interact in chat input
		if (interaction.isChatInputCommand()) {
			const guildSnapshot = interaction.client.api.guilds[interaction.guild.id];
			const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), interaction.guild.id);

			if (!guildSnapshot.commands || !Object.keys(guildSnapshot.commands).includes(command.name)) {
				set(child(child(guildRef, "commands"), command.name), true);
			}
			if ((typeof guildSnapshot.commands[command.name] === "boolean") && (command.enable !== guildSnapshot.commands[command.name])) {
				command.enable = guildSnapshot.commands[command.name];
			}
			if (!command.enable) {
				return await interaction.reply(interaction.client.translate.events.interactionCreate.command_is_disabled);
			}

			try {
				command.function.command.execute(interaction);

				// Stores information when the bot is working properly.
				if (interaction.client.mode === "start") {
					set(ref(getDatabase(), "statistics/shioru/size/worked"), increment(1) || 1);
					set(child(ref(getDatabase(), "statistics/shioru/commands"), command.name), increment(1) || 1);
				}
			} catch (error) {
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ "content": interaction.client.translate.events.interactionCreate.command_error, "ephemeral": true });
				} else {
					await interaction.reply({ "content": interaction.client.translate.events.interactionCreate.command_error, "ephemeral": true });
				}

				catchError(interaction.client, interaction, "interactionCreate", error);
			}
		}

		// When user interact in message context menu
		if (interaction.isMessageContextMenuCommand()) {
			try {
				command.function.context.execute(interaction);

				// Stores information when the bot is working properly.
				if (interaction.client.mode === "start") {
					set(ref(getDatabase(), "statistics/shioru/size/worked"), increment(1) || 1);
					set(child(ref(getDatabase(), "statistics/shioru/context"), command.name), increment(1) || 1);
				}
			} catch (error) {
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ "content": interaction.client.translate.events.interactionCreate.command_error, "ephemeral": true });
				} else {
					await interaction.reply({ "content": interaction.client.translate.events.interactionCreate.command_error, "ephemeral": true });
				}

				catchError(interaction.client, interaction, "interactionCreate", error);
			}
		}
	}
}