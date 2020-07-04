const discord = require("discord.js");
const fs = require("fs");

module.exports.run = async function (client, message, args) {
	const embed = new discord.MessageEmbed()
		.setColor("#2C2F33")
		.setAuthor(client.user.username + " ช่วยเหลือ", client.user.displayAvatarURL())
		.setFooter("ร้องขอโดย " + message.author.tag, message.author.displayAvatarURL())
		.setTimestamp();
	if (args[0]) {
		let command = args[0];
		let cmd;
		if (client.commands.has(command)) {
			cmd = client.commands.get(command);
		} else if (client.aliases.has(command)) {
			cmd = client.commands.get(client.aliases.get(command));
		}
		if (!cmd) return message.channel.send(embed.setTitle("คำสั่งไม่ถูกต้อง").setDescription("พิมพ์ `" + client.config.prefix + "help` สำหรับรายการคำสั่งทั้งหมด"));
		command = cmd.help;
		embed.setTitle(command.name.slice(0, 1).toUpperCase() + command.name.slice(1) + "คำสั่งช่วยเหลือ");
		embed.setDescription([
			"❯ **คำสั่ง:** " + (command.name.slice(0, 1).toUpperCase() + command.name.slice(1)),
			"❯ **คำอธิบาย:** " + (command.description || "ไม่มีคำอธิบาย"),
			"❯ **วิธีใช้:** " + (command.usage ? "`" + (client.config.prefix) + (command.name) + " " + (command.usage) + "`" : "ไม่มีวิธีการใช้งาน"),
			"❯ **นามแฝง:** " + (command.aliases ? command.aliases.join(", ") : "ไม่มี"),
			"❯ **ประเภท:** " + (command.category ? command.category : "General" || "Misc")
		].join("\n"));

		return message.channel.send(embed);
	}
	const categories = fs.readdirSync("./commands/");
	embed.setDescription([
		"คำสั่งที่ใช้ได้สำหรับ " + client.user.username + ".",
		"คำนำหน้าของบอทคือ **" + client.config.prefix + "**",
		"`<>` หมายถึงจำเป็นและ `()` เป็นตัวเลือก แต่ไม่รวมสิ่งเหล่านั้น"
	].join("\n"));
	categories.forEach(function (category) {
		let dir = client.commands.filter(c => c.help.category.toLowerCase() === category.toLowerCase());
		let capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);

		try {
			if (dir.size === 0) return;
			if (client.config.owner.includes(message.author.id)) embed.addField("❯ " + (capitalise), dir.map(c => "`" + (c.help.name) + "`").join(", "));
			else if (category !== "Developer") embed.addField("❯ " + (capitalise), dir.map(c => "`" + (c.help.name) + "`").join(", "));
		} catch (e) {
			console.log(e);
		}
	});
	return message.channel.send(embed);
};

module.exports.help = {
	"name": "help",
	"description": "Get help with the use of bots.",
	"usage": "Yhelp (command)",
	"category": "information",
	"aliases": ["h", "ช่วยด้วย", "ช่วยเหลือ"]
};