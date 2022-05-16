const { getDatabase, ref, update, get } = require("firebase/database");
const catchError = require("../../extras/catchError");

module.exports = async (client, interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.interaction.get(interaction.commandName);
	
	if (!command) return;

	// Check that members have the permissions to use the application or not.
	if (!interaction.member.permissions.has("USE_APPLICATION_COMMANDS")) {
		return await interaction.reply(client.translate.events.interactionCreate.no_permission);
	}

	// Check the permissions of the command for the user.
	if (command.help.userPermissions) {
		if (!interaction.member.permissions.has(command.help.userPermissions)) {
			return await interaction.reply(client.translate.events.interactionCreate.user_is_not_allowed).replace("%s", command.help.userPermissions.join());
		}
	}

	// Check the permissions of the command for the bot.
	if (command.help.clientPermissions) {
		if (!interaction.guild.me.permissions.has(command.help.clientPermissions)) {
			return await interaction.reply(client.translate.events.interactionCreate.client_is_not_allowed).replace("%s", command.help.clientPermissions.join());
		}
	}

	await interaction.deferReply();

	try {
		await command.interaction.execute(interaction);

		// Stores information when the bot is working properly.
        if (client.mode === "start") {
            get(ref(getDatabase(), 'Shioru/data/survey')).then((snapshot) => {
				if (snapshot.exists()) {
                    let working = snapshot.val().working;

                    update(ref(getDatabase(), 'Shioru/data/survey'), {
                        "working": (working + 1)
                    });
                } else {
                    update(ref(getDatabase(), 'Shioru/data/survey'), {
                        "working": 1
                    });
                }
			});
        }
	} catch (error) {
		catchError(client, interaction, interaction.commandName, error);
	}
}