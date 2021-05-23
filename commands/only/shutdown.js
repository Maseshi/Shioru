module.exports.run = async function (client, message, args) {
    if (message.member.id !== client.data.config.data.owner) return message.channel.send(client.data.language.command_system_shutdown_dont_have_permission);
	
	let arg = args[0];
	if (!arg) return message.reply(client.data.language.command_system_shutdown_please_enter_password);

	message.delete();
	if (arg !== client.data.config.data.password) return message.channel.send(client.data.language.command_system_shutdown_password_wrong);
	message.channel.send(client.data.language.command_system_shutdown_shuting_down).then(function (msg) {
		msg.edit(client.data.language.command_system_system_off).then(function () {
			client.destroy();
		}).catch(function (error) {
			message.channel.send(client.data.language.command_system_shutdown_cant_shutdown + error);
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