const { PermissionsBitField } = require("discord.js");

module.exports = {
	"enable": true,
	"name": "reboot",
	"description": "Reboot the bot system.",
	"category": "owner",
	"permissions": {
		"client": [PermissionsBitField.Flags.SendMessages]
	},
	"usage": "reboot (password)",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
	"data": {
		"name": module.exports.name,
		"name_localizations": {
			"en-US": "reboot",
			"th": "รีบูต"
		},
		"description": module.exports.description,
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