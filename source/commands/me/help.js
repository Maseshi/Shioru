const { MessageEmbed } = require("discord.js");
const fs = require("fs");

module.exports.run = async function (client, message, args) {
	let info = new MessageEmbed()
	.setColor("#E01055")
	.setTitle(client.translate.commands.help.document_name)
	.setAuthor(client.user.username, client.user.displayAvatarURL())
	.setFooter(client.translate.commands.help.request_by + " " + message.author.username, message.author.displayAvatarURL())
	.setTimestamp();
	
	if (args[0]) {
		let command = args[0];
		let cmd;
		
		if (client.commands.has(command)) {
			cmd = client.commands.get(command);
		} else if (client.aliases.has(command)) {
			cmd = client.commands.get(client.aliases.get(command));
		}
		
		if (!cmd) {
			info.setTitle(client.translate.commands.help.command_incorrect)
			.setDescription(client.translate.commands.help.command_incorrect_guide.replace("%s", client.config.prefix))
			return message.reply({ "embeds": [ info ] });
		}

		command = cmd.help;
		info.setTitle(client.translate.commands.command_detail + command.name.slice(0, 1).toUpperCase() + command.name.slice(1))
		.setDescription([
			"```" + client.translate.commands.help.command + (command.name.slice(0, 1).toUpperCase() + command.name.slice(1)),
			client.translate.commands.help.description + (command.description || client.translate.commands.help.no_description),
			client.translate.commands.help.how_to_use + (client.config.prefix) + (command.usage ? (command.usage) : client.translate.commands.help.unknown_how_to_use),
			client.translate.commands.help.type + (command.category ? command.category : "General" || "Misc"),
			client.translate.commands.help.aliases + (command.aliases ? command.aliases.join(", ") + "```" : client.translate.commands.help.do_not_have + "```"),
			client.translate.commands.help.tip.replace("%s1", (client.config.prefix + command.name.slice(0, 1).toUpperCase() + command.name.slice(1))).replace("%s2", (client.config.prefix + command.aliases[0]))
		].join("\n"));

		message.channel.send({ "embeds": [ info ] });
	} else {
		let categories = fs.readdirSync("./source/commands/");
		
		await info.setDescription([
			client.translate.commands.help.commands_description[0],
			client.translate.commands.help.commands_description[1].replace("%s", client.config.prefix),
			client.translate.commands.help.commands_description[2],
			client.translate.commands.help.commands_description[3].replace("%s", (client.config.prefix + module.exports.help.name))
		].join("\n"));
		
		categories.forEach(function (category) {
			let dir = client.commands.filter(dirs => dirs.help.category.toLowerCase() === category.toLowerCase());
			let capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);

			if (!dir.size) return;
			if (category === "developer") return info.addField("⌨ " + (capitalise), dir.map(dirs => "`" + (dirs.help.name) + "`").join(", "));
			if (category === "only") return info.addField("🔒 " + (capitalise), dir.map(dirs => "`" + (dirs.help.name) + "`").join(", "));
			info.addField("🏷️ " + (capitalise), dir.map(dirs => "`" + (dirs.help.name) + "`").join(", "));
		});
		
		message.channel.send({ "embeds": [ info ] });
	}
};

module.exports.help = {
	"name": "help",
	"description": "Get help with the use of bots.",
	"usage": "help (command: name, aliases)",
	"category": "me",
	"aliases": ["h", "ช่วยด้วย", "ช่วยเหลือ"],
	"permissions": ["SEND_MESSAGES"]
};