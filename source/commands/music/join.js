const { PermissionsBitField } = require("discord.js");

module.exports = {
	"enable": true,
	"name": "join",
	"description": "Join the audio channel.",
	"category": "music",
	"permissions": {
		"user": [PermissionsBitField.Flags.Connect],
		"client": [
			PermissionsBitField.Flags.SendMessages,
			PermissionsBitField.Flags.Connect
		]
	},
	"usage": "join [channel",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
	"data": {
		"name": module.exports.name,
		"name_localizations": {
			"th": "เข้าร่วม"
		},
		"description": module.exports.description,
		"description_localizations": {
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
		const inputChannel = interaction.options.getChannel("channel") ?? "";

		const queue = interaction.client.music.getQueue(interaction);

		if (queue && interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.reply(interaction.client.translate.commands.join.another_player_is_playing);
		if (!inputChannel) {
			const voiceChannel = interaction.member.voice.channel;
			const meChannel = interaction.guild.members.me.voice.channel;

			if (!voiceChannel) return await interaction.reply(interaction.client.translate.commands.join.not_in_channel);
			if (meChannel && meChannel.id === voiceChannel.id) return await interaction.reply(interaction.client.translate.commands.join.already_joined);

			interaction.client.music.voices.join(voiceChannel);
			await interaction.reply(interaction.client.translate.commands.join.joined.replace("%s", voiceChannel.id));
		} else {
			interaction.client.music.voices.join(inputChannel);
			await interaction.reply(interaction.client.translate.commands.join.channel_joined.replace("%s", inputChannel.id));
		}
	}
}
