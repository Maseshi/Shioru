const discord = require("discord.js");
const fs = require("fs");

module.exports.run = async function (client, message, args) {
	let info = new discord.MessageEmbed()
	.setColor("#E01055")
	.setTitle(client.lang.command_information_help_embed_title)
	.setAuthor(client.user.username, client.user.displayAvatarURL())
	.setFooter(client.lang.command_information_help_embed_footer_name + message.author.username, message.author.displayAvatarURL())
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
			message.channel.send(info.setTitle(client.lang.command_information_help_if_dont_have_cmd_embed_edit_title).setDescription(client.lang.command_information_help_if_dont_have_cmd_embed_edit_description.replace("%prefix", client.config.prefix)));
		} else {
			command = cmd.help;
			info.setTitle(client.lang.command_information_help_else_have_cmd_embed_edit_title + command.name.slice(0, 1).toUpperCase() + command.name.slice(1));
			info.setDescription([
				client.lang.command_information_help_else_have_cmd_embed_edit_description_line_0 + (command.name.slice(0, 1).toUpperCase() + command.name.slice(1)),
				client.lang.command_information_help_else_have_cmd_embed_edit_description_line_1 + (command.description || client.lang.command_information_help_else_have_cmd_embed_edit_description_or_line_1),
				client.lang.command_information_help_else_have_cmd_embed_edit_description_line_2 + (client.config.prefix) + (command.usage ? (command.usage) : client.lang.command_information_help_else_have_cmd_embed_edit_description_or_line_2),
				client.lang.command_information_help_else_have_cmd_embed_edit_description_line_3 + (command.category ? command.category : "General" || "Misc"),
				client.lang.command_information_help_else_have_cmd_embed_edit_description_line_4 + (command.aliases ? command.aliases.join(", ") + "```" : client.lang.command_information_help_else_have_cmd_embed_edit_description_or_line_4 + "```"),
				client.lang.command_information_help_else_have_cmd_embed_edit_description_line_5.replace("%cmd", (client.config.prefix + command.name.slice(0, 1).toUpperCase() + command.name.slice(1))).replace("%aliases", (client.config.prefix + command.aliases[0]))
			].join("\n"));

			message.channel.send(info);
		}
	} else {
		let categories = fs.readdirSync("./commands/");
		await info.setDescription([
			client.lang.command_information_help_else_have_args_embed_edit_description[0],
			client.lang.command_information_help_else_have_args_embed_edit_description[1].replace("%prefix", client.config.prefix),
			client.lang.command_information_help_else_have_args_embed_edit_description[2],
			client.lang.command_information_help_else_have_args_embed_edit_description[3].replace("%prefix", client.config.prefix)
		].join("\n"));
		categories.forEach(function (category) {
			let dir = client.commands.filter(c => c.help.category.toLowerCase() === category.toLowerCase());
			let capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);

			try {
				if (dir.size === 0) {
					return;
				} else {
					if (client.config.owner.includes(message.author.id)) {
						info.addField("🏷️ " + (capitalise), dir.map(c => "`" + (c.help.name) + "`").join(", "));
					} else if (category !== "Developer") {
						info.addField("🔩 " + (capitalise), dir.map(c => "`" + (c.help.name) + "`").join(", "));
					}
				}
			} catch (error) {
				console.log(error);
			}
		});
		
		message.channel.send(info);
	}
};

module.exports.help = {
	"name": "help",
	"description": "Get help with the use of bots.",
	"usage": "help (command)",
	"category": "information",
	"aliases": ["h", "ช่วยด้วย", "ช่วยเหลือ"]
};