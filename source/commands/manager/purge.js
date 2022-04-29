const catchError = require("../../extras/catchError");

module.exports.run = (client, message, args) => {
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
			catchError(client, message, module.exports.help.name, error);
		});
	});
};

module.exports.help = {
	"name": "purge",
	"description": "Delete a lot of messages",
	"usage": "purge <amount>",
	"category": "manager",
	"aliases": ["clear", "messagedelete", "ลบข้อความ"],
	"userPermissions": ["READ_MESSAGE_HISTORY", "MANAGE_MESSAGES"],
	"clientPermissions": ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "MANAGE_MESSAGES"]
};

module.exports.interaction = {
	"data": {
		"name": module.exports.help.name,
		"name_localizations": {
            "en-US": "purge",
            "th": "ล้าง"
        },
		"description": module.exports.help.description,
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
				catchError(interaction.client, interaction, module.exports.help.name, error);
			});
		});
	}
};