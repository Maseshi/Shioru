const catchError = require("../../extras/catchError");

module.exports.run = function (client, message, args) {
    if (message.member.id !== client.config.owner) return message.channel.send(client.translate.commands.reboot.not_owner);
	
	let arg = args[0];
	if (!arg) return message.reply(client.translate.commands.reboot.password_is_required);
	if (arg === client.config.password) return message.reply(client.translate.commands.reboot.password_is_incorrect);
	
	message.channel.send(client.translate.commands.reboot.rebooting).then(function (msg) {
		client.destroy();
		client.login(client.config.token);
		msg.edit(client.translate.commands.reboot.now_reboot);
	}).catch(function (error) {
		catchError(client, message, module.exports.help.name, error);
	});
};

module.exports.help = {
	"name": "reboot",
	"description": "Reboot the bot system.",
	"usage": "reboot <password>",
	"category": "only",
	"aliases": ["re", "เริ่มระบบใหม่"],
	"permissions": "ADMINISTRATOR"
};