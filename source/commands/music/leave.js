const { getVoiceConnection } = require("@discordjs/voice");

module.exports.run = (client, message, args) => {
	const inputChannel = args.join(" ");
	const queue = client.music.getQueue(message);

	if (queue && message.author.id !== queue.songs[0].user.id && queue.autoplay === false) return message.reply(client.translate.commands.leave.another_player_is_playing);
	if (!inputChannel) {
		const meChannel = message.guild.me.voice.channel;
		
		if (!meChannel) return message.reply(client.translate.commands.leave.not_in_any_channel);
		
		const connection = getVoiceConnection(meChannel.guild.id);
		
		connection.destroy();
		message.channel.send(client.translate.commands.leave.now_leave);
	} else {
		const channel = client.channels.cache.find(channels => (channels.id === inputChannel) || (channels.name === inputChannel));
		
		if (channel.type === "GUILD_TEXT") return message.reply(client.translate.commands.leave.that_is_text_channel);
		if (!channel) return message.reply(client.translate.commands.leave.no_channel);
		if (message.guild.me.voice.id !== channel.id) return message.reply(client.translate.commands.leave.me_not_in_that_channel);

		const connection = getVoiceConnection(channel.guild.id);
		
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
	"clientPermissions": ["SEND_MESSAGES"]
};