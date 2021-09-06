const catchError = require("../../extras/catchError");

module.exports.run = function (client, message, args) {
    if (message.member.id !== client.config.owner) return message.channel.send(client.translate.commands.shutdown.not_owner);
	
	let arg = args[0];
	if (!arg) return message.reply(client.translate.commands.shutdown.password_is_required);
	if (arg !== client.config.password) return message.channel.send(client.translate.commands.shutdown.password_is_incorrect);

	message.channel.send(client.translate.commands.shutdown.shutting_down).then(function (msg) {
		msg.edit(client.translate.commands.shutdown.now_shutdown).then(function () {
			client.destroy();
		}).catch(function (error) {
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
	"permissions": "ADMINISTRATOR"
};