module.exports.run = async function (client, message, args) {
    if (message.member.id !== client.config.owner) return message.channel.send(client.lang.command_system_shutdown_dont_have_permission);
	
	let arg = args[0];
	if (!arg) return message.reply(client.lang.command_system_shutdown_please_enter_password);

	message.delete();
	if (arg !== client.config.password) return message.channel.send(client.lang.command_system_shutdown_password_wrong);
	message.channel.send(client.lang.command_system_shutdown_shuting_down).then(function (msg) {
		msg.edit(client.lang.command_system_system_off).then(function () {
			client.destroy();
		}).catch(function (error) {
			message.channel.send(client.lang.command_system_shutdown_cant_shutdown + error);
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