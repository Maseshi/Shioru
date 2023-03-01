const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { readdirSync } = require("node:fs");

module.exports = {
	"enable": true,
	"name": "help",
	"description": "Get help with the use of bots.",
	"category": "me",
	"permissions": {
		"client": [PermissionsBitField.Flags.SendMessages]
	},
	"usage": "help (command: name, aliases)",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
	"data": {
		"name": module.exports.name,
		"name_localizations": {
			"en-US": "help",
			"th": "ช่วยด้วย"
		},
		"description": module.exports.description,
		"description_localizations": {
			"en-US": "Get help with the use of bots.",
			"th": "รับความช่วยเหลือเกี่ยวกับการใช้บอท"
		},
		"options": [
			{
				"type": 3,
				"name": "command",
				"name_localizations": {
					"th": "คำสั่ง"
				},
				"description": "The command or alias you want to ask for help, eg play.",
				"description_localizations": {
					"th": "คำสั่งหรือนามแฝงที่คุณต้องการขอความช่วยเหลือเช่น play"
				},
				"required": false
			}
		]
	},
	async execute(interaction) {
		let inputCommand = interaction.options.get("command");

		const info = new EmbedBuilder()
			.setColor("#E01055")
			.setTitle(interaction.client.translate.commands.help.document_name)
			.setAuthor({ "name": interaction.client.user.username, "iconURL": interaction.client.user.displayAvatarURL() })
			.setFooter({ "text": interaction.client.translate.commands.help.request_by + " " + interaction.user.username, "iconURL": interaction.user.displayAvatarURL() })
			.setTimestamp();

		if (inputCommand) {
			let commands;

			if (interaction.client.commands.has(inputCommand.value)) commands = interaction.client.commands.get(inputCommand.value);
			if (interaction.client.aliases.has(inputCommand.value)) commands = interaction.client.commands.get(interaction.client.aliases.get(inputCommand.value));
			if (!commands) {
				info.setTitle(interaction.client.translate.commands.help.command_incorrect)
					.setDescription(interaction.client.translate.commands.help.command_incorrect_guide)

				return await interaction.editReply({ "embeds": [info] });
			}

			inputCommand = commands;

			info.setTitle(interaction.client.translate.commands.help.command_detail + inputCommand.name.slice(0, 1).toUpperCase() + inputCommand.name.slice(1))
				.setDescription([
					"```" + interaction.client.translate.commands.help.command + (inputCommand.name.slice(0, 1).toUpperCase() + inputCommand.name.slice(1)),
					interaction.client.translate.commands.help.description + (inputCommand.description || interaction.client.translate.commands.help.no_description),
					interaction.client.translate.commands.help.how_to_use + "/" + (inputCommand.command.usage ? inputCommand.command.usage : interaction.client.translate.commands.help.unknown_how_to_use),
					interaction.client.translate.commands.help.type + (inputCommand.category ? inputCommand.category : "General")
				].join("\n"));

			await interaction.editReply({ "embeds": [info] });
		} else {
			const categories = readdirSync("./source/commands/");

			await info.setDescription([
				interaction.client.translate.commands.help.commands_description[0],
				interaction.client.translate.commands.help.commands_description[1],
				interaction.client.translate.commands.help.commands_description[2],
				interaction.client.translate.commands.help.commands_description[3]
			].join("\n"));

			categories.forEach((category) => {
				const dir = interaction.client.commands.filter(dirs => dirs.category.toLowerCase() === category.toLowerCase());
				const categorize = category.slice(0, 1).toUpperCase() + category.slice(1);

				if (!dir.size) return;
				if (category === "owner" && interaction.user.id !== interaction.client.config.owner) return;
				if (category === "owner") return info.addFields({ "name": "🔒 " + categorize + " - (" + dir.size + ")", "value": dir.map(dirs => "`" + dirs.name + "`").join(", ") });
				if (category === "developer") return info.addFields({ "name": "⌨ " + categorize + " - (" + dir.size + ")", "value": dir.map(dirs => "`" + dirs.name + "`").join(", ") });
				if (category === "settings") return info.addFields({ "name": "⚙️ " + categorize + " - (" + dir.size + ")", "value": dir.map(dirs => "`" + dirs.name + "`").join(", ") });

				info.addFields(
					{
						"name": "🏷️ " + categorize + " - (" + dir.size + ")",
						"value": dir.map(dirs => dirs.interaction.enable ? ("`" + dirs.name + "`") : ("||" + dirs.name + "||")).join(", ")
					}
				);
			});

			await interaction.editReply({ "embeds": [info] });
		}
	}
};