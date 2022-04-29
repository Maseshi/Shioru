module.exports.run = async (client, message, args) => {
	if (message.member.id !== client.config.owner) return message.reply(client.translate.commands.reboot.not_owner);

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

		owner.send("**:arrows_counterclockwise: มีคำขอสำหรับการรีสตาร์ทระบบใหม่ค่าา!!**\nเพื่อยืนยันว่าเป็นท่านกรุณากรอกรหัสผ่านนี้ในเซิร์ฟเวอร์ที่ท่านเรียกใช้คำสั่ง\nท่านสามารถละเว้นได้หากไม่ต้องการดำเนินการต่อ\nขอขอบคุณที่ท่านยังดูแลฉันมาจนถึงทุกวันนี้นะคะ :)\n||%s||".replace("%s", password));
	}
	if (!inputPassword) return message.reply(client.translate.commands.reboot.password_is_required);
	if (inputPassword !== client.temp.password) return message.reply(client.translate.commands.reboot.password_is_incorrect);

	message.channel.send(client.translate.commands.reboot.rebooting).then(async (msg) => {
		await client.destroy();
		client.login(client.config.token);
		msg.edit(client.translate.commands.reboot.now_reboot);
	});
};

module.exports.help = {
	"name": "reboot",
	"description": "Reboot the bot system.",
	"usage": "reboot (password)",
	"category": "owner",
	"aliases": ["re", "restart", "เริ่มระบบใหม่"],
	"clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
	"data": {
		"name": module.exports.help.name,
		"name_localizations": {
			"en-US": "reboot",
			"th": "รีบูต"
		},
		"description": module.exports.help.description,
		"description_localizations": {
			"en-US": "Reboot the bot system.",
			"th": "รีบูตระบบบอท"
		},
		"options": [
			{
				"type": 3,
				"name": "password",
				"name_localizations": {
					"th": "รหัสผ่าน"
				},
				"description": "Password for confirming bot reboot.",
				"description_localizations": {
					"th": "รหัสผ่านสำหรับยืนยันการรีบูตบอท"
				},
				"required": false
			}
		]
	},
	async execute(interaction) {
		if (interaction.user.id !== interaction.client.config.owner) return await interaction.editReply(interaction.client.translate.commands.reboot.not_owner);

		const inputPassword = interaction.options.get("password");

		if (!interaction.client.temp.password) {
			const owner = await interaction.client.users.fetch(interaction.client.config.owner);
			let chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			let password = "";

			interaction.client.temp.password = 0;

			for (let i = 0; i <= 12; i++) {
				let randomNumber = Math.floor(Math.random() * chars.length);
				password += chars.substring(randomNumber, randomNumber + 1);
			}

			interaction.client.temp.password = password;

			owner.send("**:arrows_counterclockwise: มีคำขอสำหรับการรีสตาร์ทระบบใหม่ค่าา!!**\nเพื่อยืนยันว่าเป็นท่านกรุณากรอกรหัสผ่านนี้ในเซิร์ฟเวอร์ที่ท่านเรียกใช้คำสั่ง\nท่านสามารถละเว้นได้หากไม่ต้องการดำเนินการต่อ\nขอขอบคุณที่ท่านยังดูแลฉันมาจนถึงทุกวันนี้นะคะ :)\n||%s||".replace("%s", password));
		}
		if (inputPassword.value !== interaction.client.temp.password) return await interaction.editReply(interaction.client.translate.commands.reboot.password_is_incorrect);

		await interaction.editReply(interaction.client.translate.commands.reboot.rebooting);
		await interaction.client.destroy();
		await interaction.client.login(interaction.client.config.token);
		await interaction.editReply(interaction.client.translate.commands.reboot.now_reboot);
	}
};