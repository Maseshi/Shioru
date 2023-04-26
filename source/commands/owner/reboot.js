const { PermissionsBitField } = require("discord.js");

module.exports = {
	"enable": true,
	"name": "reboot",
	"description": "Reboot the bot system.",
	"category": "owner",
	"permissions": {
		"client": [PermissionsBitField.Flags.SendMessages]
	},
	"usage": "reboot [password(String)]",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
	"data": {
		"name": module.exports.name,
		"name_localizations": {
			"th": "รีบูต"
		},
		"description": module.exports.description,
		"description_localizations": {
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
		if ((interaction.user.id !== interaction.client.config.team.owner) || (!interaction.client.config.team.developer.includes(interaction.user.id))) return await interaction.reply(interaction.client.translate.commands.reboot.not_owner);

		const inputPassword = interaction.options.getString("password") ?? "";

		if (!interaction.client.temp.password) {
			const owner = await interaction.client.users.fetch(interaction.client.config.team.owner);
			let chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			let password = "";

			interaction.client.temp.password = 0;

			for (let i = 0; i <= 12; i++) {
				let randomNumber = Math.floor(Math.random() * chars.length);
				password += chars.substring(randomNumber, randomNumber + 1);
			}

			interaction.client.temp.password = password;

			owner.send(interaction.client.translate.commands.reboot.dm_to_owner.replace("%s", password));
		}
		if (inputPassword !== interaction.client.temp.password) return await interaction.reply(interaction.client.translate.commands.reboot.password_is_incorrect);

		await interaction.reply(interaction.client.translate.commands.reboot.rebooting);
		await interaction.client.destroy();
		await interaction.client.login(interaction.client.config.token);
		await interaction.editReply(interaction.client.translate.commands.reboot.now_reboot);
	}
};