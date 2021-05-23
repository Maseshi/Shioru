const discord = require("discord.js");
const fs = require("fs");

module.exports.run = async function (client, message, args) {
	let info = new discord.MessageEmbed()
	.setColor("#E01055")
	.setTitle(client.data.language.command_information_help_embed_title)
	.setAuthor(client.user.username, client.user.displayAvatarURL())
	.setFooter(client.data.language.command_information_help_embed_footer_name + message.author.username, message.author.displayAvatarURL())
	.setTimestamp();
	
	if (args[0]) {
		let command = args[0];
		let cmd;
		
		if (client.commands.has(command)) {
			cmd = client.commands.get(command);
		} else if (client.aliases.has(command)) {
			cmd = client.commands.get(client.aliases.get(command));
		}
		
		if (!cmd) return message.reply(info.setTitle(client.data.language.command_information_help_if_dont_have_cmd_embed_edit_title).setDescription(client.data.language.command_information_help_if_dont_have_cmd_embed_edit_description.replace("%prefix", client.data.config.client.prefix)));

		command = cmd.help;
		info.setTitle(client.data.language.command_information_help_else_have_cmd_embed_edit_title + command.name.slice(0, 1).toUpperCase() + command.name.slice(1))
		.setDescription([
			client.data.language.command_information_help_else_have_cmd_embed_edit_description_line_0 + (command.name.slice(0, 1).toUpperCase() + command.name.slice(1)),
			client.data.language.command_information_help_else_have_cmd_embed_edit_description_line_1 + (command.description || client.data.language.command_information_help_else_have_cmd_embed_edit_description_or_line_1),
			client.data.language.command_information_help_else_have_cmd_embed_edit_description_line_2 + (client.data.config.client.prefix) + (command.usage ? (command.usage) : client.data.language.command_information_help_else_have_cmd_embed_edit_description_or_line_2),
			client.data.language.command_information_help_else_have_cmd_embed_edit_description_line_3 + (command.category ? command.category : "General" || "Misc"),
			client.data.language.command_information_help_else_have_cmd_embed_edit_description_line_4 + (command.aliases ? command.aliases.join(", ") + "```" : client.data.language.command_information_help_else_have_cmd_embed_edit_description_or_line_4 + "```"),
			client.data.language.command_information_help_else_have_cmd_embed_edit_description_line_5.replace("%cmd", (client.data.config.client.prefix + command.name.slice(0, 1).toUpperCase() + command.name.slice(1))).replace("%aliases", (client.data.config.client.prefix + command.aliases[0]))
		].join("\n"));

		message.channel.send(info);
	} else {
		let categories = fs.readdirSync("./commands/");
		
		await info.setDescription([
			client.data.language.command_information_help_else_have_args_embed_edit_description[0],
			client.data.language.command_information_help_else_have_args_embed_edit_description[1].replace("%prefix", client.data.config.client.prefix),
			client.data.language.command_information_help_else_have_args_embed_edit_description[2],
			client.data.language.command_information_help_else_have_args_embed_edit_description[3].replace("%prefix", client.data.config.client.prefix)
		].join("\n"));
		
		categories.forEach(function (category) {
			let dir = client.commands.filter(dirs => dirs.help.category.toLowerCase() === category.toLowerCase());
			let capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);

			if (!dir.size) return;

			if (category === "only") return info.addField("🔒 " + (capitalise), dir.map(dirs => "`" + (dirs.help.name) + "`").join(", "));
			info.addField("🏷️ " + (capitalise), dir.map(dirs => "`" + (dirs.help.name) + "`").join(", "));
		});
		
		message.channel.send(info);
	}
};

module.exports.help = {
	"name": "help",
	"description": "Get help with the use of bots.",
	"usage": "help (command: name, aliases)",
	"category": "information",
	"aliases": ["h", "ช่วยด้วย", "ช่วยเหลือ"],
	"permissions": ["SEND_MESSAGES"]
};