const discord = require("discord.js");
const fs = require("fs");

module.exports.run = async function (client, message, args) {
	let embed = new discord.MessageEmbed()
	.setColor("#E01055")
	.setTitle("เอกสารข้อมูลช่วยเหลือ")
	.setAuthor(client.user.username, client.user.displayAvatarURL())
	.setFooter("ร้องขอโดย " + message.author.username, message.author.displayAvatarURL())
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
			message.channel.send(embed.setTitle("❎ คำสั่งไม่ถูกต้อง").setDescription("เอ๋...ไม่มีคำสั่งนี้นะคะ ลองตรวจสอบใหม่โดยพิมพ์ `" + client.config.prefix + "help` เพื่อดูรายการคำสั่งทั้งหมดของฉันคะ"));
		} else {
			command = cmd.help;
			embed.setTitle("📑 รายละเอียดของคำสั่ง " + command.name.slice(0, 1).toUpperCase() + command.name.slice(1));
			embed.setDescription([
				"```คำสั่ง: " + (command.name.slice(0, 1).toUpperCase() + command.name.slice(1)),
				"คำอธิบาย: " + (command.description || "ไม่มีคำอธิบาย"),
				"วิธีใช้: " + (command.usage ? (command.usage) : "ไม่มีวิธีการใช้งาน"),
				"ประเภท: " + (command.category ? command.category : "General" || "Misc"),
				"นามแฝง: " + (command.aliases ? command.aliases.join(", ") + "```" : "ไม่มี" + "```"),
				"เคล็ดลับ: **นามแฝง** สามารถใช้แทนคำสั่งของแต่ละคำสั่งได้ เช่น `" + (client.config.prefix + command.name.slice(0, 1).toUpperCase() + command.name.slice(1)) + "` แทนด้วย `" + (client.config.prefix + command.aliases[0]) + "`"
			].join("\n"));

			message.channel.send(embed);
		}
	} else {
		let categories = fs.readdirSync("./commands/");
		embed.setDescription([
			"คำสั่งทั้งหมดที่ฉันได้เรียนหรือศึกษามา เข้าใจและใช้งานได้จริง",
			"ซึ่งก่อนเรียกฉัน ต้องมีตัวนำหน้าคือ **" + client.config.prefix + "**",
			"`<>` หมายถึงจำเป็นและ `()` เป็นตัวเลือก อาจจะตอบหรือไม่จำเป็นต้องตอบก็ได้",
			"สำหรับรายละเอียดของแต่ละคำสั่งให้พิมพ์ว่า `Yhelp คำสั่ง` แล้วคำอธิฐานจะเป็นจริง!!"
		].join("\n"));
		categories.forEach(function (category) {
			let dir = client.commands.filter(c => c.help.category.toLowerCase() === category.toLowerCase());
			let capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);

			try {
				if (dir.size === 0) {
					return;
				} else {
					if (client.config.owner.includes(message.author.id)) {
						embed.addField("🏷️ " + (capitalise), dir.map(c => "`" + (c.help.name) + "`").join(", "));
					} else if (category !== "Developer") {
						embed.addField("🏷️ " + (capitalise), dir.map(c => "`" + (c.help.name) + "`").join(", "));
					}
				}
			} catch (error) {
				console.log(error);
			}
		});
		
		message.channel.send(embed);
	}
};

module.exports.help = {
	"name": "help",
	"description": "Get help with the use of bots.",
	"usage": "Yhelp (command)",
	"category": "information",
	"aliases": ["h", "ช่วยด้วย", "ช่วยเหลือ"]
};