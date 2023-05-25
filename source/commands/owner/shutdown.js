const { PermissionsBitField } = require("discord.js");

module.exports = {
	"enable": true,
	"name": "shutdown",
	"description": "Shutdown the bot system.",
	"category": "owner",
	"permissions": {
		"client": [PermissionsBitField.Flags.SendMessages]
	},
	"usage": "shutdown [password(String)]",
	"function": {
		"command": {}
	}
};

module.exports.function.command = {
	"data": {
		"name": module.exports.name,
		"name_localizations": {
			"th": "ปิดตัวลง"
		},
		"description": module.exports.description,
		"description_localizations": {
			"th": "ปิดระบบบอท"
		},
		"options": [
			{
				"type": 3,
				"name": "password",
				"name_localizations": {
					"th": "รหัสผ่าน"
				},
				"description": "Password to confirm the shutdown of the bot.",
				"description_localizations": {
					"th": "รหัสผ่านเพื่อยืนยันการปิดระบบของบอท"
				},
				"required": false
			}
		]
	},
	async execute(interaction) {
		const inputPassword = interaction.options.getString("password") ?? "";

		const teamOwner = parseInt(interaction.client.config.team.owner);
        const teamDev = interaction.client.config.team.developer.map(Number);

		if ((interaction.user.id !== teamOwner) || (!teamDev.includes(interaction.user.id))) return await interaction.reply(interaction.client.translate.commands.shutdown.not_owner);
		if (!interaction.client.temp.password) {
			const owner = await interaction.client.users.fetch(teamOwner);
			const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			let password = "";

			interaction.client.temp.password = 0;

			for (let i = 0; i <= 12; i++) {
				let randomNumber = Math.floor(Math.random() * chars.length);
				password += chars.substring(randomNumber, randomNumber + 1);
			}

			interaction.client.temp.password = password;

			owner.send(interaction.client.translate.commands.shutdown.dm_to_owner.replace("%s", password));
		}
		if (inputPassword !== interaction.client.temp.password) return await interaction.reply(interaction.client.translate.commands.shutdown.password_is_incorrect);

		await interaction.reply(interaction.client.translate.commands.shutdown.shutting_down);
		await interaction.client.destroy();
		await interaction.editReply(interaction.client.translate.commands.shutdown.now_shutdown);

		process.exit();
	}
};