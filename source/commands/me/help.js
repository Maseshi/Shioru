const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { readdirSync } = require("node:fs");
const { BitwisePermissionFlags } = require("../../utils/clientUtils");

module.exports = {
	"enable": true,
	"name": "help",
	"description": "Get help with the use of bots.",
	"category": "me",
	"permissions": {
		"client": [PermissionsBitField.Flags.SendMessages]
	},
	"usage": "help [command(String)]",
	"function": {
		"command": {}
	}
};

module.exports.function.command = {
	"data": {
		"name": module.exports.name,
		"name_localizations": {
			"th": "ช่วยด้วย"
		},
		"description": module.exports.description,
		"description_localizations": {
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
		const inputCommand = interaction.options.getString("command") ?? "";

		const info = new EmbedBuilder()
			.setColor("#E01055")
			.setTitle(interaction.client.translate.commands.help.document_name)
			.setURL("https://shiorus.web.app/commands")
			.setAuthor({ "name": interaction.client.user.username, "iconURL": interaction.client.user.displayAvatarURL() })
			.setFooter({ "text": interaction.client.translate.commands.help.request_by + " " + interaction.user.username, "iconURL": interaction.user.displayAvatarURL() })
			.setTimestamp();

		if (inputCommand) {
			const command = interaction.client.commands.get(inputCommand);

			if (!command) {
				info.setTitle(interaction.client.translate.commands.help.command_incorrect)
					.setDescription(interaction.client.translate.commands.help.command_incorrect_guide)

				await interaction.reply({ "embeds": [info] });
			} else {
				info.setTitle(interaction.client.translate.commands.help.command_detail + command.name.slice(0, 1).toUpperCase() + command.name.slice(1))
					.setDescription([
						interaction.client.translate.commands.help.commands_description[2],
						"```",
						interaction.client.translate.commands.help.command.replace("%s", (command.name.slice(0, 1).toUpperCase() + command.name.slice(1))),
						interaction.client.translate.commands.help.description.replace("%s", (command.description ?? interaction.client.translate.commands.help.no_description)),
						interaction.client.translate.commands.help.how_to_use.replace("%s", ("/" + (command.usage ?? interaction.client.translate.commands.help.unknown_how_to_use))),
						interaction.client.translate.commands.help.category.replace("%s", (command.category ?? "General")),
						interaction.client.translate.commands.help.user_permissions.replace("%s", (command.permissions.user ? command.permissions.user.map(permission => BitwisePermissionFlags[permission]).join(", ") : interaction.client.translate.commands.help.no_need_permissions)),
						interaction.client.translate.commands.help.client_permissions.replace("%s", (command.permissions.client ? command.permissions.client.map(permission => BitwisePermissionFlags[permission]).join(", ") : interaction.client.translate.commands.help.no_need_permissions)),
						"```"
					].join("\n"));

				await interaction.reply({ "embeds": [info] });
			}
		} else {
			const categories = readdirSync("./source/commands/");

			info.setDescription(interaction.client.translate.commands.help.commands_description.join("\n"));

			categories.forEach((category) => {
				const dir = interaction.client.commands.filter(dirs => dirs.category.toLowerCase() === category.toLowerCase());
				const categorize = category.slice(0, 1).toUpperCase() + category.slice(1);

				if (!dir.size) return;
				if (category === "owner" && ((interaction.user.id !== interaction.client.config.team.owner) || (!interaction.client.config.team.developer.includes(interaction.user.id)))) return;
				if (category === "owner") return info.addFields({ "name": "🔒 " + categorize + " - (" + dir.size + ")", "value": dir.map(dirs => "`" + dirs.name + "`").join(", ") });
				if (category === "developer") return info.addFields({ "name": "⌨ " + categorize + " - (" + dir.size + ")", "value": dir.map(dirs => "`" + dirs.name + "`").join(", ") });
				if (category === "settings") return info.addFields({ "name": "⚙️ " + categorize + " - (" + dir.size + ")", "value": dir.map(dirs => "`" + dirs.name + "`").join(", ") });

				info.addFields(
					{
						"name": "🏷️ " + categorize + " - (" + dir.size + ")",
						"value": dir.map(dirs => dirs.enable ? ("`" + dirs.name + "`") : ("||" + dirs.name + "||")).join(", ")
					}
				);
			});

			await interaction.reply({ "embeds": [info] });
		}
	}
};