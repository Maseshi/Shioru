const { ChannelType } = require("discord.js");

module.exports = {
	"name": "join",
	"description": "Join the audio channel.",
	"category": "music",
	"permissions": {
		"user": ["CONNECT"],
		"client": ["SEND_MESSAGES", "CONNECT"]
	}
};

module.exports.command = {
	"enable": true,
	"usage": "join (channel: name, id)",
	"aliases": ["j", "เข้า", "เข้าร่วม"],
	async execute(client, message, args) {
		const inputChannel = args.join(" ");
		
		const queue = client.music.getQueue(message);
	
		if (queue && message.author.id !== queue.songs[0].user.id && queue.autoplay === false) return message.reply(client.translate.commands.join.another_player_is_playing);
		if (!inputChannel) {
			const voiceChannel = message.member.voice.channel;
			const meChannel = message.guild.members.me.voice.channel;
	
			if (!voiceChannel) return message.reply(client.translate.commands.join.not_in_channel);
			if (meChannel && meChannel.id === voiceChannel.id) return message.reply(client.translate.commands.join.already_joined);
	
			client.music.voices.join(voiceChannel);
			message.channel.send(client.translate.commands.join.joined.replace("%s", voiceChannel.id));
		} else {
			const channel = message.guild.channels.cache.find(channels => (channels.id === inputChannel) || (channels.name === inputChannel));
	
			if (channel.type === ChannelType.GuildVoice) {
				if (!channel) return message.reply(client.translate.commands.join.no_channel);
	
				client.music.voices.join(channel);
				message.channel.send(client.translate.commands.join.channel_joined.replace("%s", channel.id));
			} else {
				message.reply(client.translate.commands.join.not_a_voice_channel);
			}
		}
	}
}

module.exports.interaction = {
	"enable": true,
	"data": {
		"name": module.exports.name,
		"name_localizations": {
            "en-US": "join",
            "th": "เข้าร่วม"
        },
		"description": module.exports.description,
		"description_localizations": {
            "en-US": "Join the audio channel.",
            "th": "เข้าร่วมช่องสัญญาณเสียง"
        },
		"options": [
			{
				"type": 7,
				"name": "channel",
				"name_localizations": {
					"th": "ช่อง"
				},
				"description": "The channel you want the bot to participate in advance.",
				"description_localizations": {
					"th": "ช่องที่คุณต้องการให้บอทเข้าร่วมล่วงหน้า"
				},
				"required": false,
				"channel_types": [
					2,
					13
				]
			}
		]
	},
	async execute(interaction) {
		const inputChannel = interaction.options.get("channel");
		
		const queue = interaction.client.music.getQueue(interaction);

		if (queue && interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.editReply(interaction.client.translate.commands.join.another_player_is_playing);
		if (!inputChannel) {
			const voiceChannel = interaction.member.voice.channel;
			const meChannel = interaction.guild.members.me.voice.channel;

			if (!voiceChannel) return await interaction.editReply(interaction.client.translate.commands.join.not_in_channel);
			if (meChannel && meChannel.id === voiceChannel.id) return await interaction.editReply(interaction.client.translate.commands.join.already_joined);

			interaction.client.music.voices.join(voiceChannel);
			await interaction.editReply(interaction.client.translate.commands.join.joined.replace("%s", voiceChannel.id));
		} else {
			const channel = interaction.guild.channels.cache.find(channels => (channels.id === inputChannel.value) || (channels.name === inputChannel.value));

			if (!channel) return await interaction.editReply(interaction.client.translate.commands.join.no_channel);

			interaction.client.music.voices.join(channel);
			await interaction.editReply(interaction.client.translate.commands.join.channel_joined.replace("%s", channel.id));
		}
	}
}
