const catchError = require("../../extras/catchError");

module.exports.run = (client, message, args) => {
	let messageCount = parseInt(args[0]) + 1;

	if (!messageCount) return message.reply(client.translate.commands.purge.purge_instructions);
	if (messageCount > 100) return message.reply(client.translate.commands.purge.too_much);
	if (messageCount <= 0) return message.reply(client.translate.commands.purge.too_little);
	
	message.channel.messages.fetch({
		"limit": messageCount
	}).then((messages) => {
		message.channel.bulkDelete(messages, true);
		message.channel.send(client.translate.commands.purge.message_cleared.replace("%s", messages.size));
	}).catch((error) => {
		catchError(client, message, module.exports.help.name, error);
	});
};
	
module.exports.help = {
	"name": "purge",
	"description": "Delete a lot of messages",
	"usage": "purge <amount>",
	"category": "guild",
	"aliases": ["clear", "messageDelete", "ลบข้อความ"],
	"userPermission": ["READ_MESSAGE_HISTORY", "MANAGE_MESSAGES"],
	"clientPermissions": ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "MANAGE_MESSAGES"]
};