const { catchError } = require("../../utils/consoleUtils");

module.exports = {
	"name": "purge",
	"description": "Delete a lot of messages",
	"category": "manager",
	"permissions": {
		"user": ["READ_MESSAGE_HISTORY", "MANAGE_MESSAGES"],
		"client": ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "MANAGE_MESSAGES"]
	}
};

module.exports.command = {
	"enable": true,
	"usage": "purge <amount>",
	"aliases": ["clear", "messagedelete", "ลบข้อความ"],
	async execute(client, message, args) {
		let messageCount = parseInt(args[0]);

		if (!messageCount) return message.reply(client.translate.commands.purge.purge_instructions);
		if (messageCount > 100) return message.reply(client.translate.commands.purge.too_much);
		if (messageCount <= 0) return message.reply(client.translate.commands.purge.too_little);

		message.channel.messages.fetch({
			"limit": 1
		}).then((previousMessages) => {
			message.channel.messages.fetch({
				"limit": messageCount,
				"before": previousMessages.first().id
			}).then(async (messages) => {
				await message.channel.bulkDelete(messages, true);
				message.channel.send(client.translate.commands.purge.message_cleared.replace("%s", messages.size));
			}).catch((error) => {
				catchError(client, message, module.exports.name, error);
			});
		});
	}
}

module.exports.interaction = {
	"enable": true,
	"data": {
		"name": module.exports.name,
		"name_localizations": {
			"en-US": "purge",
			"th": "ล้าง"
		},
		"description": module.exports.description,
		"description_localizations": {
			"en-US": "Delete a lot of messages",
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
		let messageCount = interaction.options.get("amount").value;

		interaction.channel.messages.fetch({
			"limit": 1
		}).then((previousMessages) => {
			interaction.channel.messages.fetch({
				"limit": messageCount,
				"before": previousMessages.first().id
			}).then(async (messages) => {
				await interaction.channel.bulkDelete(messages, true);
				await interaction.editReply(interaction.client.translate.commands.purge.message_cleared.replace("%s", messages.size));
			}).catch((error) => {
				catchError(interaction.client, interaction, module.exports.name, error);
			});
		});
	}
};