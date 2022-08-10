module.exports = {
	"name": "leave",
	"description": "Exits the current audio channel.",
	"category": "music",
	"permissions": {
		"client": ["SEND_MESSAGES"]
	}
};

module.exports.command = {
	"enable": true,
	"usage": "leave",
	"aliases": ["l", "dc", "dis", "disconnect", "ออก", "ออกจาก"],
	async execute(client, message, args) {
		const queue = client.music.getQueue(message);

		const meChannel = message.guild.members.me.voice.channel;

		if (queue && message.author.id !== queue.songs[0].user.id && queue.autoplay === false) return message.reply(client.translate.commands.leave.another_player_is_playing);
		if (!meChannel) return message.reply(client.translate.commands.leave.not_in_any_channel);

		const connection = client.music.voices.get(meChannel.guild);

		connection.leave(meChannel.guild);
		message.channel.send(client.translate.commands.leave.now_leave);
	}
}

module.exports.interaction = {
	"enable": true,
	"data": {
		"name": module.exports.name,
		"name_localizations": {
			"en-US": "leave",
			"th": "ออก"
		},
		"description": module.exports.description,
		"description_localizations": {
			"en-US": "Exits the current audio channel.",
			"th": "ออกจากช่องสัญญาณเสียงปัจจุบัน"
		}
	},
	async execute(interaction) {
		const queue = interaction.client.music.getQueue(interaction);

		const meChannel = interaction.guild.members.me.voice.channel;

		if (queue && interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.editReply(interaction.client.translate.commands.leave.another_player_is_playing);
		if (!meChannel) return await interaction.editReply(interaction.client.translate.commands.leave.not_in_any_channel);

		const connection = interaction.client.music.voices.get(meChannel.guild);

		connection.leave(meChannel.guild);
		await interaction.editReply(interaction.client.translate.commands.leave.now_leave);
	}
}