module.exports.run = (client, message, args) => {
	const queue = client.music.getQueue(message);
	const meChannel = message.guild.me.voice.channel;

	if (queue && message.author.id !== queue.songs[0].user.id && queue.autoplay === false) return message.reply(client.translate.commands.leave.another_player_is_playing);
	if (!meChannel) return message.reply(client.translate.commands.leave.not_in_any_channel);

	const connection = client.music.voices.get(meChannel.guild);

	connection.leave(meChannel.guild);
	message.channel.send(client.translate.commands.leave.now_leave);
};

module.exports.help = {
	"name": "leave",
	"description": "Exits the current audio channel.",
	"usage": "leave",
	"category": "music",
	"aliases": ["l", "dc", "dis", "disconnect", "ออก", "ออกจาก"],
	"clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
	"data": {
		"name": module.exports.help.name,
		"name_localizations": {
			"en-US": "leave",
			"th": "ออก"
		},
		"description": module.exports.help.description,
		"description_localizations": {
			"en-US": "Exits the current audio channel.",
			"th": "ออกจากช่องสัญญาณเสียงปัจจุบัน"
		}
	},
	async execute(interaction) {
		const queue = interaction.client.music.getQueue(interaction);
		const meChannel = interaction.guild.me.voice.channel;

		if (queue && interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.editReply(interaction.client.translate.commands.leave.another_player_is_playing);
		if (!meChannel) return await interaction.editReply(interaction.client.translate.commands.leave.not_in_any_channel);

		const connection = interaction.client.music.voices.get(meChannel.guild);

		connection.leave(meChannel.guild);
		await interaction.editReply(interaction.client.translate.commands.leave.now_leave);
	}
}