const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("node:fs");

module.exports.run = async (client, message, args) => {
	let inputCommand = args[0];

	const info = new MessageEmbed()
		.setColor("#E01055")
		.setTitle(client.translate.commands.help.document_name)
		.setAuthor({ "name": client.user.username, "iconURL": client.user.displayAvatarURL() })
		.setFooter({ "text": client.translate.commands.help.request_by + " " + message.author.username, "iconURL": message.author.displayAvatarURL() })
		.setTimestamp();

	if (inputCommand) {
		let commands;

		if (client.commands.has(inputCommand)) commands = client.commands.get(inputCommand);
		if (client.aliases.has(inputCommand)) commands = client.commands.get(client.aliases.get(inputCommand));
		if (!commands) {
			info
				.setTitle(client.translate.commands.help.command_incorrect)
				.setDescription(client.translate.commands.help.command_incorrect_guide.replace("%s", client.config.prefix))

			return message.reply({ "embeds": [info] });
		}

		inputCommand = commands.help;

		info
			.setTitle(client.translate.commands.help.command_detail + inputCommand.name.slice(0, 1).toUpperCase() + inputCommand.name.slice(1))
			.setDescription([
				"```" + client.translate.commands.help.command + (inputCommand.name.slice(0, 1).toUpperCase() + inputCommand.name.slice(1)),
				client.translate.commands.help.description + (inputCommand.description || client.translate.commands.help.no_description),
				client.translate.commands.help.how_to_use + client.config.prefix + (inputCommand.usage ? inputCommand.usage : client.translate.commands.help.unknown_how_to_use),
				client.translate.commands.help.type + (inputCommand.category ? inputCommand.category : "General" || "Misc"),
				client.translate.commands.help.aliases + (inputCommand.aliases ? inputCommand.aliases.join(", ") + "```" : client.translate.commands.help.do_not_have + "```"),
				client.translate.commands.help.tip.replace("%s1", (client.config.prefix + inputCommand.name.slice(0, 1).toUpperCase() + inputCommand.name.slice(1))).replace("%s2", (client.config.prefix + inputCommand.aliases[0]))
			].join("\n"));

		message.channel.send({ "embeds": [info] });
	} else {
		const categories = readdirSync("./source/commands/");

		await info.setDescription([
			client.translate.commands.help.commands_description[0],
			client.translate.commands.help.commands_description[1].replace("%s", client.config.prefix),
			client.translate.commands.help.commands_description[2],
			client.translate.commands.help.commands_description[3].replace("%s1", (client.config.prefix + module.exports.help.name)).replace("%s2", ("/" + module.exports.help.name))
		].join("\n"));

		categories.forEach((category) => {
			const dir = client.commands.filter(dirs => dirs.help.category.toLowerCase() === category.toLowerCase());
			const categorize = category.slice(0, 1).toUpperCase() + category.slice(1);

			if (!dir.size) return;
			if (category === "owner" && message.author.id !== client.config.owner) return;
			if (category === "owner") return info.addField("🔒 " + categorize + " - (" + dir.size + ")", dir.map(dirs => "`" + dirs.help.name + "`").join(", "));
			if (category === "developer") return info.addField("⌨ " + categorize + " - (" + dir.size + ")", dir.map(dirs => "`" + dirs.help.name + "`").join(", "));
			if (category === "settings") return info.addField("⚙️ " + categorize + " - (" + dir.size + ")", dir.map(dirs => "`" + dirs.help.name + "`").join(", "));

			info.addField("🏷️ " + categorize + " - (" + dir.size + ")", dir.map(dirs => "`" + dirs.help.name + "`").join(", "));
		});

		message.channel.send({ "embeds": [info] });
	}
};

module.exports.help = {
	"name": "help",
	"description": "Get help with the use of bots.",
	"usage": "help (command: name, aliases)",
	"category": "me",
	"aliases": ["h", "ช่วยด้วย", "ช่วยเหลือ"],
	"clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
	"data": {
		"name": module.exports.help.name,
		"name_localizations": {
            "en-US": "help",
            "th": "ช่วยด้วย"
        },
		"description": module.exports.help.description,
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

		const info = new MessageEmbed()
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
				info
					.setTitle(interaction.client.translate.commands.help.command_incorrect)
					.setDescription(interaction.client.translate.commands.help.command_incorrect_guide.replace("%s", interaction.client.config.prefix))

				return await interaction.editReply({ "embeds": [info] });
			}

			inputCommand = commands.help;

			info
				.setTitle(interaction.client.translate.commands.help.command_detail + inputCommand.name.slice(0, 1).toUpperCase() + inputCommand.name.slice(1))
				.setDescription([
					"```" + interaction.client.translate.commands.help.command + (inputCommand.name.slice(0, 1).toUpperCase() + inputCommand.name.slice(1)),
					interaction.client.translate.commands.help.description + (inputCommand.description || interaction.client.translate.commands.help.no_description),
					interaction.client.translate.commands.help.how_to_use + interaction.client.config.prefix + (inputCommand.usage ? inputCommand.usage : interaction.client.translate.commands.help.unknown_how_to_use),
					interaction.client.translate.commands.help.type + (inputCommand.category ? inputCommand.category : "General" || "Misc"),
					interaction.client.translate.commands.help.aliases + (inputCommand.aliases ? inputCommand.aliases.join(", ") + "```" : interaction.client.translate.commands.help.do_not_have + "```"),
					interaction.client.translate.commands.help.tip.replace("%s1", (interaction.client.config.prefix + inputCommand.name.slice(0, 1).toUpperCase() + inputCommand.name.slice(1))).replace("%s2", (interaction.client.config.prefix + inputCommand.aliases[0]))
				].join("\n"));

			await interaction.editReply({ "embeds": [info] });
		} else {
			const categories = readdirSync("./source/commands/");

			await info.setDescription([
				interaction.client.translate.commands.help.commands_description[0],
				interaction.client.translate.commands.help.commands_description[1].replace("%s", interaction.client.config.prefix),
				interaction.client.translate.commands.help.commands_description[2],
				interaction.client.translate.commands.help.commands_description[3].replace("%s1", (interaction.client.config.prefix + module.exports.help.name)).replace("%s2", ("/" + module.exports.help.name))
			].join("\n"));

			categories.forEach((category) => {
				const dir = interaction.client.commands.filter(dirs => dirs.help.category.toLowerCase() === category.toLowerCase());
				const categorize = category.slice(0, 1).toUpperCase() + category.slice(1);

				if (!dir.size) return;
				if (category === "owner" && interaction.user.id !== interaction.client.config.owner) return;
				if (category === "owner") return info.addField("🔒 " + categorize + " - (" + dir.size + ")", dir.map(dirs => "`" + dirs.help.name + "`").join(", "));
				if (category === "developer") return info.addField("⌨ " + categorize + " - (" + dir.size + ")", dir.map(dirs => "`" + dirs.help.name + "`").join(", "));
				if (category === "settings") return info.addField("⚙️ " + categorize + " - (" + dir.size + ")", dir.map(dirs => "`" + dirs.help.name + "`").join(", "));

				info.addField("🏷️ " + categorize + " - (" + dir.size + ")", dir.map(dirs => "`" + dirs.help.name + "`").join(", "));
			});

			await interaction.editReply({ "embeds": [info] });
		}
	}
};