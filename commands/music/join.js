module.exports.run = async function (client, message, args) {
	let arg = args.join(" ");
	if (arg === "") {
		let voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			message.reply(client.lang.command_music_join_user_not_join_channel);
		} else {
			voiceChannel.join()
			.then(function (connection) {
				message.channel.send(client.lang.command_music_join_me_in_channel.replace("%channel", connection.channel.name));
			}).catch(function (error) {
				message.channel.send(client.lang.command_music_join_channel_join_catch_error + error);
			});
		}
	} else {
		let channel = client.channels.cache.find(channels => (channels.id === arg) || (channels.name === arg));
		if (!channel) {
			message.channel.send(client.lang.command_music_join_with_id_not_found_channel);
		} else {
			channel.join()
			.then(function (connection) {
				message.channel.send(client.lang.command_music_join_with_id_me_in_channel.replace("%channel", connection.channel.name));
			});
		}
	}
};

module.exports.help = {
	"name": "join",
	"description": "Join audio channel",
	"usage": "join (channel<name, id>)",
	"category": "music",
	"aliases": ["j", "เข้า", "เข้าร่วม"]
};
