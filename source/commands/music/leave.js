const { getVoiceConnection } = require("@discordjs/voice");

module.exports.run = function (client, message, args) {
	let arg = args.join(" ");

	if (!arg) {
		let voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.reply(client.translate.commands.leave.do_not_have_channel);
		
		let connection = getVoiceConnection(voiceChannel.guild.id);
		connection.destroy();
		message.channel.send(client.translate.commands.leave.now_leave);
	} else {
		let channel = client.channels.cache.find(channels => (channels.id === arg) || (channels.name === arg));
		if (channel.type === "GUILD_TEXT") return message.reply(client.translate.commands.leave.that_is_text_channel);
		if (!channel) return message.reply(client.translate.commands.leave.no_channel);
		if (message.guild.me.voice.id !== channel.id) return message.reply(client.translate.commands.leave.me_not_in_that_channel);

		let connection = getVoiceConnection(channel.guild.id);
		connection.destroy();
		message.channel.send(client.translate.commands.leave.now_leave);
	}
};

module.exports.help = {
	"name": "leave",
	"description": "Out of the current audio channel",
	"usage": "leave (channel: name, id)",
	"category": "music",
	"aliases": ["l", "dc", "dis", "disconnect", "ออก", "ออกจาก"],
	"permissions": ["SEND_MESSAGES", "CONNECT"]
};