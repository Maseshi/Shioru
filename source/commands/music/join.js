const { joinVoiceChannel } = require("@discordjs/voice");
const catchError = require("../../extras/catchError");

module.exports.run = function (client, message, args) {
	let arg = args.join(" ");
	
	if (!arg) {
		let voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.reply(client.translate.commands.join.not_in_channel);
		
		try {
			joinVoiceChannel({
				"channelId": voiceChannel.id,
				"guildId": message.guild.id,
				"adapterCreator": message.guild.voiceAdapterCreator
			});
			message.channel.send(client.translate.commands.join.joined.replace("%s", voiceChannel.name));
		} catch (err) {
			catchError(client, message, module.exports.help.name, err);
		}
	} else {
		let channel = message.guild.channels.cache.find(channels => (channels.id === arg) || (channels.name === arg));
		if (channel.type === "GUILD_TEXT") return message.reply(client.translate.commands.join.this_is_text_channel);
		if (!channel) return message.reply(client.translate.commands.join.no_channel);

		try {
			joinVoiceChannel({
				"channelId": channel.id,
				"guildId": message.guild.id,
				"adapterCreator": message.guild.voiceAdapterCreator
			});
			message.channel.send(client.translate.commands.join.channel_joined.replace("%s", channel.name));
		} catch (err) {
			catchError(client, message, module.exports.help.name, err);
		}
	}
};

module.exports.help = {
	"name": "join",
	"description": "Join audio channel",
	"usage": "join (channel: name, id)",
	"category": "music",
	"aliases": ["j", "เข้า", "เข้าร่วม"],
	"permissions": ["SEND_MESSAGES", "CONNECT"]
};
