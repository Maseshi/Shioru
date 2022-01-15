const { joinVoiceChannel } = require("@discordjs/voice");
const catchError = require("../../extras/catchError");

module.exports.run = (client, message, args) => {
	const inputChannel = args.join(" ");
	const queue = client.music.getQueue(message);

	if (queue && message.author.id !== queue.songs[0].user.id) return message.reply(client.translate.commands.join.another_player_is_playing);
	if (!inputChannel) {
		const voiceChannel = message.member.voice.channel;
		const meChannel = message.guild.me.voice.channel;
		
		if (!voiceChannel) return message.reply(client.translate.commands.join.not_in_channel);
		if (meChannel && meChannel.id === voiceChannel.id) return message.reply(client.translate.commands.join.already_joined);
		
		try {
			joinVoiceChannel({
				"channelId": voiceChannel.id,
				"guildId": message.guild.id,
				"adapterCreator": message.guild.voiceAdapterCreator
			});

			message.channel.send(client.translate.commands.join.joined.replace("%s", voiceChannel.name));
		} catch (error) {
			catchError(client, message, module.exports.help.name, error);
		}
	} else {
		const channel = message.guild.channels.cache.find(channels => (channels.id === inputChannel) || (channels.name === inputChannel));
		
		if (channel.type === "GUILD_TEXT") return message.reply(client.translate.commands.join.this_is_text_channel);
		if (!channel) return message.reply(client.translate.commands.join.no_channel);

		try {
			joinVoiceChannel({
				"channelId": channel.id,
				"guildId": message.guild.id,
				"adapterCreator": message.guild.voiceAdapterCreator
			});

			message.channel.send(client.translate.commands.join.channel_joined.replace("%s", channel.name));
		} catch (error) {
			catchError(client, message, module.exports.help.name, error);
		}
	}
};

module.exports.help = {
	"name": "join",
	"description": "Join audio channel",
	"usage": "join (channel: name, id)",
	"category": "music",
	"aliases": ["j", "เข้า", "เข้าร่วม"],
	"clientPermissions": ["SEND_MESSAGES", "SPEAK", "CONNECT"]
};
