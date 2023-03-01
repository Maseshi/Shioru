const { ChannelType, PermissionsBitField } = require("discord.js");
const { getDatabase, ref, child, set, increment } = require("firebase/database");
const { BitwisePermissionFlags } = require("../../utils/clientUtils");
const { catchError, ansiColor } = require("../../utils/consoleUtils");
const { levelSystem, settingsData } = require("../../utils/databaseUtils");

module.exports = async (client, interaction) => {
	const guildSnapshot = client.api.guilds[interaction.guild.id];
	const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), interaction.guild.id);
	const command = client.commands.get(interaction.commandName);

	const clearStyle = ansiColor(0, "sgr");
	const underlineStyle = ansiColor(4, "sgr");
	const blueBrightColor = ansiColor(33, "foreground");

	if (interaction.user.bot) return;
	if (interaction.channel.type === ChannelType.DM) return;
	if (client.mode === "start") {
		settingsData(client, interaction.guild, module.exports, interaction);
		if (client.temp.set !== 1) return;

		levelSystem(client, interaction, "POST", 123);
	}

	if (!command) return console.log(underlineStyle + interaction.user.username + clearStyle + " Type an unknown command: " + blueBrightColor + commandName + clearStyle);

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
	if (guildSnapshot.commands[command.name] === undefined) {
		return set(child(child(guildRef, "commands"), command.name), true).then(() => module.exports(client, interaction));
	}
	if (!guildSnapshot.commands[command.name]) {
		command.enable = false;
	}
	if (!command.enable) {
		return await interaction.reply(client.translate.events.interactionCreate.command_is_disabled);
	}

	if (interaction.isChatInputCommand()) {
		await interaction.deferReply();

		try {
			await command.function.command.execute(interaction);

			// Stores information when the bot is working properly.
			if (client.mode === "start") {
				set(ref(getDatabase(), "statistics/shioru/size/worked"), increment(1) || 1);
				set(child(ref(getDatabase(), "statistics/shioru/commands"), command.name), increment(1) || 1);
			}
		} catch (error) {
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ "content": client.translate.events.interactionCreate.command_error, "ephemeral": true });
			} else {
				await interaction.reply({ "content": client.translate.events.interactionCreate.command_error, "ephemeral": true });
			}

			catchError(client, interaction, interaction.commandName, error);
		}
	}
	if (interaction.isMessageContextMenuCommand()) {
		await interaction.deferReply({ "ephemeral": true });

		try {
			await command.function.context.execute(interaction);

			// Stores information when the bot is working properly.
			if (client.mode === "start") {
				set(ref(getDatabase(), "statistics/shioru/size/worked"), increment(1) || 1);
				set(child(ref(getDatabase(), "statistics/shioru/context"), command.name), increment(1) || 1);
			}
		} catch (error) {
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ "content": client.translate.events.interactionCreate.command_error, "ephemeral": true });
			} else {
				await interaction.reply({ "content": client.translate.events.interactionCreate.command_error, "ephemeral": true });
			}

			catchError(client, interaction, interaction.commandName, error);
		}
	}
}