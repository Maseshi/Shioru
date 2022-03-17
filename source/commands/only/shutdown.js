const catchError = require("../../extras/catchError");

module.exports.run = async (client, message, args) => {
    if (message.member.id !== client.config.owner) return message.reply(client.translate.commands.shutdown.not_owner);
	
	const inputPassword = args[0];

	if (!client.temp.password) {
		const owner = await client.users.fetch(client.config.owner);
		let chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let password = "";

		client.temp.password = 0;

		for (let i = 0; i <= 12; i++) {
			let randomNumber = Math.floor(Math.random() * chars.length);
			password += chars.substring(randomNumber, randomNumber + 1);
		}

		client.temp.password = password;

		owner.send("**:red_circle: มีคำขอสำหรับการปิดระบบค่าา!!**\nเพื่อยืนยันว่าเป็นท่านกรุณากรอกรหัสผ่านนี้ในเซิร์ฟเวอร์ที่ท่านเรียกใช้คำสั่ง\nท่านสามารถละเว้นได้หากไม่ต้องการดำเนินการต่อ\nขอขอบคุณที่ท่านยังดูแลฉันมาจนถึงทุกวันนี้นะคะ :)\n||%s||".replace("%s", password));
	}
	if (!inputPassword) return message.reply(client.translate.commands.shutdown.password_is_required);
	if (inputPassword !== client.temp.password) return message.reply(client.translate.commands.shutdown.password_is_incorrect);

	message.channel.send(client.translate.commands.shutdown.shutting_down).then((msg) => {
		msg.edit(client.translate.commands.shutdown.now_shutdown).then(async () => {
			await client.destroy();
			process.exit();
		}).catch((error) => {
			catchError(client, message, module.exports.help.name, error);
		});
	});
};
	
module.exports.help = {
	"name": "shutdown",
	"description": "Shutdown the bot system.",
	"usage": "shutdown <password>",
	"category": "only",
	"aliases": ["sd", "ปิดระบบ"],
	"userPermission": ["ADMINISTRATOR"],
	"clientPermissions": ["SEND_MESSAGES"]
};