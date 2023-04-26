const { PermissionsBitField } = require("discord.js");
const { catchError } = require("../../utils/consoleUtils");

module.exports = {
	"enable": true,
	"name": "purge",
	"description": "Delete a lot of messages",
	"category": "manager",
	"permissions": {
		"user": [
			PermissionsBitField.Flags.ReadMessageHistory,
			PermissionsBitField.Flags.ManageMessages
		],
		"client": [
			PermissionsBitField.Flags.SendMessages,
			PermissionsBitField.Flags.ReadMessageHistory,
			PermissionsBitField.Flags.ManageMessages
		]
	},
	"usage": "purge <amount(Number)>",
	"function": {
		"command": {}
	}
};

module.exports.function.command = {
	"data": {
		"name": module.exports.name,
		"name_localizations": {
			"th": "ล้าง"
		},
		"description": module.exports.description,
		"description_localizations": {
			"th": "ลบข้อความจำนวนมาก"
		},
		"options": [
			{
				"type": 10,
				"name": "amount",
				"name_localizations": {
					"th": "จำนวน"
				},
				"description": "The amount of messages to delete",
				"description_localizations": {
					"th": "จำนวนข้อความที่จะลบ"
				},
				"required": true,
				"min_value": 0,
				"max_value": 100
			}
		]
	},
	async execute(interaction) {
		const inputAmount = interaction.options.getNumber("amount");

		const previousMessages = await interaction.channel.messages.fetch({ "limit": 1 });

		try {
			const messages = await interaction.channel.messages.fetch({
				"limit": inputAmount,
				"before": previousMessages.first().id
			});

			await interaction.channel.bulkDelete(messages, true);
			await interaction.reply(interaction.client.translate.commands.purge.message_cleared.replace("%s", messages.size));
		} catch (error) {
			catchError(interaction.client, interaction, module.exports.name, error);
		}
	}
};