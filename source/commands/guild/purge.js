const catchError = require("../../extras/catchError");

module.exports.run = function (client, message, args) {
	let messageCount = parseInt(args[0]) + 1;

	if (!messageCount) return message.reply(client.translate.commands.purge.purge_instructions);
	if (messageCount > 100) return message.reply(client.translate.commands.purge.too_much);
	if (messageCount <= 0) return message.reply(client.translate.commands.purge.too_little);
	
	message.channel.messages.fetch({
		"limit": messageCount
	}).then(function (messages) {
		message.channel.bulkDelete(messages, true);
		message.channel.send(client.translate.commands.purge.message_cleared.replace("%s", messages.size));
	}).catch(function (error) {
		catchError(client, message, module.exports.help.name, error);
	});
};
	
module.exports.help = {
	"name": "purge",
	"description": "Delete a lot of messages",
	"usage": "purge <amount: 1 - 100>",
	"category": "guild",
	"aliases": ["clear", "messageDelete", "ลบข้อความ"],
	"permissions": ["SEND_MESSAGES", "MANAGE_MESSAGES"]
};